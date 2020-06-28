/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
registerBlockType( 'create-block/em-services', {
	/**
	 * This is the display title for your block, which can be translated with `i18n` functions.
	 * The block inserter will show this name.
	 */
	title: __( 'Em Services', 'create-block' ),

	/**
	 * This is a short description for your block, can be translated with `i18n` functions.
	 * It will be shown in the Block Tab in the Settings Sidebar.
	 */
	description: __(
		'Display a list of services available in a tiled layout',
		'create-block'
	),

	/**
	 * Blocks are grouped into categories to help users browse and discover them.
	 * The categories provided by core are `common`, `embed`, `formatting`, `layout` and `widgets`.
	 */
	category: 'widgets',

	/**
	 * An icon property should be specified to make it easier to identify a block.
	 * These can be any of WordPress’ Dashicons, or a custom svg element.
	 */
	icon: 'schedule',

	/**
	 * Optional block extended support features.
	 */
	supports: {
		// Removes support for an HTML mode.
		html: false,
	},

	attributes: {
		height: {
			type: 'string',
			default: '300',
		},
		columns: {
			type: 'string',
			default: '6',
		},
		gutter: {
			type: 'string',
			default: '0',
		},
		buttonLabel: {
			type: 'string',
			default: 'Open',
		},
	},

	/**
	 * @see ./edit.js
	 */
	edit: Edit,

} );

import { registerPlugin } from "@wordpress/plugins";
import { PluginSidebar, PluginSidebarMoreMenuItem } from "@wordpress/edit-post";
import { PanelBody, TextControl, ColorPicker } from "@wordpress/components";
import { withSelect, withDispatch } from "@wordpress/data";

let PluginMetaFields = (props) => {
    return (
        <>
            <PanelBody
                title={__("Meta Fields Panel", "textdomain")}
                icon="admin-post"
                intialOpen={ true }
            >
				<TextControl
					value={props.number_metafield}
					type="number"
					label={__("Display Priority", "textdomain")}
					onChange={(value) => props.onMetaFieldChange(value)}
				/>
            </PanelBody>
        </>
    )
}

PluginMetaFields = withSelect(
    (select) => {
        return {
            number_metafield: select('core/editor').getEditedPostAttribute('meta')['_service_display_priority']
        }
    }
)(PluginMetaFields);

PluginMetaFields = withDispatch(
    (dispatch) => {
        return {
            onMetaFieldChange: (value) => {
                dispatch('core/editor').editPost({meta: {_service_display_priority: value}})
            }
        }
    }
)(PluginMetaFields);

registerPlugin( 'myprefix-sidebar', {
    icon: 'schedule',
    render: () => {
        return (
            <>
                <PluginSidebarMoreMenuItem
                    target="myprefix-sidebar"
                >
                    {__('Meta Options', 'textdomain')}
                </PluginSidebarMoreMenuItem>
                <PluginSidebar
                    name="myprefix-sidebar"
                    title={__('Meta Options', 'textdomain')}
                >
                    <PluginMetaFields />
                </PluginSidebar>
            </>
        )
    }
})