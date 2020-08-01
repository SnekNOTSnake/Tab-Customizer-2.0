import React from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { idbAction } from '../../utils/helpers';
import useStyle from '../styles/BackgroundPreview-style';

import Dialog from '@material-ui/core/Dialog';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import CropIcon from '@material-ui/icons/Crop';

const initCrop = {
	unit: '%',
	width: 30,
	aspect: 16 / 9,
};

const BackgroundPreview = ({
	previewIsOpen,
	closePreview,
	imagePreview,
	forceUpdate,
}) => {
	const { image, imageInfo, key, safe } = imagePreview;
	const classes = useStyle();

	// Crop
	const imgRef = React.useRef(null);
	const [cropping, setCropping] = React.useState(false);
	const [crop, setCrop] = React.useState(initCrop);

	const getCroppedImg = (image, crop, fileName) => {
		const canvas = document.createElement('canvas');
		const scaleX = image.naturalWidth / image.width;
		const scaleY = image.naturalHeight / image.height;
		canvas.width = Math.ceil(crop.width * scaleX);
		canvas.height = Math.ceil(crop.height * scaleY);
		const ctx = canvas.getContext('2d');

		ctx.drawImage(
			image,
			crop.x * scaleX,
			crop.y * scaleY,
			crop.width * scaleX,
			crop.height * scaleY,
			0,
			0,
			Math.ceil(crop.width * scaleX),
			Math.ceil(crop.height * scaleY)
		);

		return new Promise((resolve, reject) => {
			canvas.toBlob(
				(blob) => {
					if (!blob) {
						//reject(new Error('Canvas is empty'));
						console.error('Canvas is empty');
						return;
					}
					blob.name = fileName;
					resolve(new File([blob], fileName));
				},
				'image/jpeg',
				0.85
			);
		});
	};

	// On Preview Close
	const handleClosePreview = () => {
		setCrop(initCrop);
		setCropping(false);
		closePreview();
	};

	const cropConfirmHandler = async () => {
		const file = await getCroppedImg(imgRef.current, crop, imageInfo.name);
		const reader = new FileReader();
		reader.onload = () => {
			idbAction('backgrounds', 'updateOne', {
				key,
				data: { image: file, safe },
			}).then((value) => {
				handleClosePreview();
				forceUpdate();
			});
		};
		reader.readAsDataURL(file);
	};

	const onLoad = React.useCallback((img) => {
		imgRef.current = img;
	}, []);

	return (
		<Dialog
			onClose={handleClosePreview}
			open={previewIsOpen}
			maxWidth="lg"
			classes={{
				paper: classes.dialogPaper,
			}}
			className={classes.root}
			scroll="body"
		>
			<Tooltip title="Crop" arrow>
				<Fab
					onClick={() => setCropping((initVal) => !initVal)}
					className={classes.cropButton}
					color="primary"
				>
					<CropIcon />
				</Fab>
			</Tooltip>
			{cropping && (
				<Fab
					style={{
						position: 'absolute',
						left: '5%',
						bottom: '5%',
						zIndex: 100,
					}}
					color="primary"
					onClick={cropConfirmHandler}
				>
					Done
				</Fab>
			)}
			{cropping ? (
				<ReactCrop
					ruleOfThirds
					src={image}
					crop={crop}
					onImageLoaded={onLoad}
					onChange={setCrop}
				/>
			) : (
				<img alt="Preview" src={image} />
			)}
		</Dialog>
	);
};

export default BackgroundPreview;
