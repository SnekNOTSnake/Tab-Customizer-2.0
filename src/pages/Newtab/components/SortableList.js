import React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import clsx from 'clsx';

import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/AddRounded';

// Sortable HOC
const SortableItem = SortableElement(({ item, classes, openContext }) => (
	<a
		href={item.url}
		index={item.key}
		onContextMenu={openContext}
		className={classes.shortcut}
		key={item.key}
	>
		<Paper
			style={{ backgroundImage: `url(${item.image})` }}
			className={classes.icon}
		/>
		<div className={classes.text}>{item.name}</div>
	</a>
));

const SortableList = SortableContainer(
	({ items, classes, openContext, openDialog }) => {
		return (
			<div className={classes.sortable}>
				{items.map((item, index) => (
					<SortableItem
						openContext={openContext}
						classes={classes}
						index={index}
						item={item}
						key={item.key}
					/>
				))}
				<div className={clsx(classes.shortcut, classes.addShortcut)}>
					<Paper onClick={() => openDialog()} className={classes.icon}>
						<AddIcon className={classes.addShortcutIcon} />
					</Paper>
				</div>
			</div>
		);
	}
);

export default SortableList;
