// allIcons.js
import * as allIcons from '@phosphor-icons/react';

// Get the names of all the icons
const iconNames = Object.keys(allIcons);

// Create an array of icon objects containing the name and component
const availableIcons = iconNames.map((name) => ({
  name,
  component: allIcons[name],
}));

export default availableIcons;
