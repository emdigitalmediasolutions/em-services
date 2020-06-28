<?php
/**
 * Plugin Name:     EM Services Display
 * Description:     A display for a services post type.
 * Version:         1.0.0
 * Author:          The WordPress Contributors
 * License:         GPL-2.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     create-block
 *
 * @package         create-block
 */


function render_block_em_services( $block_attributes, $content ) {

	$columns = isset($block_attributes['columns']) ? $block_attributes['columns'] : '6';
	$columns = intval($columns);
	if (($columns < 1) || ($columns > 6))
	{
		$columns = 6;
	}

	$gutter = isset($block_attributes['gutter']) ? $block_attributes['gutter'] : '0';
	$gutter = floatval($gutter);

	$height = isset($block_attributes['height']) ? $block_attributes['height'] : '300';
	$height = intval($height);

	$buttonLabel = isset($block_attributes['buttonLabel']) ? $block_attributes['buttonLabel'] : 'Open';

	$query = new WP_Query(array(
		'post_type' => 'service',
		'post_status' => 'publish',
		'posts_per_page' => -1,
		'meta_key' => '_service_display_priority',
		'orderby' => 'meta_value_num',
		'order' => 'ASC'
	));

	$result = '<div style="line-height: 0;">';
	
	while ($query->have_posts()) {
		$post = $query->the_post();

		$result .= '<div class="service-container columns-' . $columns . '" style="padding: ' . $gutter . 'rem;">';
		$result .=   '<div class="service" style="';
		if (has_post_thumbnail())
		{
			$result .= ' background-image: url(\'' . get_the_post_thumbnail_url() . '\');';
		}
		$result .=   '">';
		$result .=     '<div class="service-overlay" style="height: ' . $height . 'px;">';
		$result .=       '<div style="width: 100%;">';
		$result .=         '<p class="service-title">' . get_the_title() . '</p>';
		if (has_excerpt())
		{
			$result .=         '<p class="service-description">' . get_the_excerpt() . '</p>';
		}
		$result .=         '<a class="service-link" href="' . get_permalink() . '">';
		$result .=           $buttonLabel;
		$result .=         '</a>';
		$result .=       '</div>';
		$result .=     '</div>';
		$result .=   '</div>';
		$result .= '</div>';
	}

	$result .= '</div>';
	
	wp_reset_query();

	return $result;
}

/**
 * Registers all block assets so that they can be enqueued through the block editor
 * in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/applying-styles-with-stylesheets/
 */
function create_block_em_services_block_init() {
	$dir = dirname( __FILE__ );

	$script_asset_path = "$dir/build/index.asset.php";
	if ( ! file_exists( $script_asset_path ) ) {
		throw new Error(
			'You need to run `npm start` or `npm run build` for the "create-block/em-services" block first.'
		);
	}
	$index_js     = 'build/index.js';
	$script_asset = require( $script_asset_path );
	wp_register_script(
		'create-block-em-services-block-editor',
		plugins_url( $index_js, __FILE__ ),
		$script_asset['dependencies'],
		$script_asset['version']
	);

	$editor_css = 'build/index.css';
	wp_register_style(
		'create-block-em-services-block-editor',
		plugins_url( $editor_css, __FILE__ ),
		array(),
		filemtime( "$dir/$editor_css" )
	);

	$style_css = 'build/style-index.css';
	wp_register_style(
		'create-block-em-services-block',
		plugins_url( $style_css, __FILE__ ),
		array(),
		filemtime( "$dir/$style_css" )
	);

	register_block_type( 'create-block/em-services', array(
		'editor_script' => 'create-block-em-services-block-editor',
		'editor_style'  => 'create-block-em-services-block-editor',
		'style'         => 'create-block-em-services-block',
		'render_callback' => 'render_block_em_services',
	) );

	register_post_type('service',
        array(
            'labels' => array(
                'name' => 'Services',
                'singular_name' => 'Service',
            ),
            'public' => true,
			'has_archive' => false,
			'menu_icon' => 'dashicons-schedule',
			'capability_type' => 'post',
			'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'featured-image', 'custom-fields'),
			'show_in_rest' => true,
        )
    );
}
add_action( 'init', 'create_block_em_services_block_init' );

function myprefix_register_meta() {
    register_meta('post', '_service_display_priority', array(
        'show_in_rest' => true,
        'type' => 'string',
        'single' => true,
        'sanitize_callback' => 'sanitize_text_field',
        'auth_callback' => function() { 
            return current_user_can('edit_posts');
        }
    ));
}
add_action('init', 'myprefix_register_meta');

function myprefix_add_meta_box() {
    add_meta_box( 
        'myprefix_post_options_metabox', 
        'Post Options', 
        'myprefix_post_options_metabox_html', 
        'post', 
        'normal', 
        'default',
        array('__back_compat_meta_box' => true)
    );
}

add_action( 'add_meta_boxes', 'myprefix_add_meta_box' );

function myprefix_post_options_metabox_html($post) {
    $field_value = get_post_meta($post->ID, '_service_display_priority', true);
    wp_nonce_field( 'myprefix_update_post_metabox', 'myprefix_update_post_nonce' );
    ?>
    <p>
        <label for="service_display_priority"><?php esc_html_e( 'Text Custom Field', 'textdomain' ); ?></label>
        <br />
        <input class="widefat" type="text" name="service_display_priority" id="service_display_priority" value="<?php echo esc_attr( $field_value ); ?>" />
    </p>
    <?php
}

function myprefix_save_post_metabox($post_id, $post) {

    $edit_cap = get_post_type_object( $post->post_type )->cap->edit_post;
    if( !current_user_can( $edit_cap, $post_id )) {
        return;
    }
    if( !isset( $_POST['myprefix_update_post_nonce']) || !wp_verify_nonce( $_POST['myprefix_update_post_nonce'], 'myprefix_update_post_metabox' )) {
        return;
    }

    if(array_key_exists('service_display_priority', $_POST)) {
        update_post_meta( 
            $post_id, 
            '_service_display_priority', 
            sanitize_text_field($_POST['service_display_priority'])
        );
    }

}

add_action( 'save_post', 'myprefix_save_post_metabox', 10, 2 );