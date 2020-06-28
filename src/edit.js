/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { more } from '@wordpress/icons';
/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @param {Object} [props]           Properties passed from the editor.
 * @param {string} [props.className] Class name generated for the block.
 *
 * @return {WPElement} Element to render.
 */
export default function Edit( props ) {
	const {
		attributes: {
			height,
			columns,
			gutter,
			buttonLabel,
		},
		className,
	} = props;

	const onHeightChange = ( newHeight ) => {
		props.setAttributes( { height: newHeight === undefined ? '300' : newHeight } );
	};

	const onColumnChange = (newColumns) => {
		props.setAttributes({columns: newColumns === undefined ? '3' : newColumns});
	};

	const onGutterChange = (newGutter) => {
		props.setAttributes({gutter: newGutter === undefined ? '0' : newGutter});
	};

	const onButtonLabelChange = (newButtonLabel) => {
		props.setAttributes({buttonLabel: newButtonLabel === undefined ? 'Open' : newButtonLabel});
	}

	const exampleColumns = [];
	for (let i = 0; i < columns * 2; i++) {
		exampleColumns.push(<div className={"service-container columns-" + columns} style={{padding: gutter + 'rem'}}>
			<div className="service">
				<div class="service-overlay" style={{height: height + 'px'}}>
					<div style={{width: '100%;'}}>
						<p className="service-title">Service</p>
						<p className="service-description">Description of this service</p>
						<button className="service-link">
							{buttonLabel}
						</button>
					</div>
				</div>
			</div>
		</div>);
	}
	
	return (
		<div>
			{
				<InspectorControls>
					<PanelBody title="Display Settings" initialOpen={ true }>
						<PanelRow>
							<SelectControl
								label={ __('Maximum number of columns to display?') }
								value={columns}
								options={[
									{label: '1', value: '1'},
									{label: '2', value: '2'},
									{label: '3', value: '3'},
									{label: '4', value: '4'},
									{label: '5', value: '5'},
									{label: '6', value: '6'},
								]}
								onChange={onColumnChange}
							/>
						</PanelRow>
						<PanelRow>
							<TextControl
								label={ __('The space between each service block') }
								value={gutter}
								onChange={onGutterChange}
							/>
						</PanelRow>
						<PanelRow>
							<TextControl
								label={ __('The height of each service block in pixels') }
								value={height}
								onChange={onHeightChange}
							/>
						</PanelRow>
						<PanelRow>
							<TextControl
								label={ __('Button label') }
								value={buttonLabel}
								onChange={onButtonLabelChange}
							/>
						</PanelRow>
					</PanelBody>
				</InspectorControls>
            }
			<p className={ className } style={{lineHeight: 0}}>
				{exampleColumns}
			</p>
		</div>
	);
}
