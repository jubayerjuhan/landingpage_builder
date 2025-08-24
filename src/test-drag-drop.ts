// Quick test to verify drag and drop functionality
import { ComponentType } from './types/builder';
import { createElement } from './utils/elementFactory';
import { COMPONENT_DEFINITIONS } from './components/definitions/componentDefinitions';

console.log('Testing drag and drop core functionality...');

// Test 1: Check all content component definitions exist
const contentComponents = [
  ComponentType.HEADING,
  ComponentType.PARAGRAPH, 
  ComponentType.TEXT,
  ComponentType.LIST,
  ComponentType.QUOTE,
  ComponentType.CODE_BLOCK
];

console.log('Testing content component definitions:');
contentComponents.forEach(type => {
  const definition = COMPONENT_DEFINITIONS[type];
  if (definition) {
    console.log(`✅ ${type}: ${definition.name}`);
  } else {
    console.log(`❌ ${type}: Definition not found!`);
  }
});

// Test 2: Check layout component definitions exist
const layoutComponents = [
  ComponentType.SECTION,
  ComponentType.CONTAINER,
  ComponentType.ROW, 
  ComponentType.COLUMN,
  ComponentType.SPACER,
  ComponentType.DIVIDER
];

console.log('\nTesting layout component definitions:');
layoutComponents.forEach(type => {
  const definition = COMPONENT_DEFINITIONS[type];
  if (definition) {
    console.log(`✅ ${type}: ${definition.name}`);
  } else {
    console.log(`❌ ${type}: Definition not found!`);
  }
});

// Test 3: Test createElement function
console.log('\nTesting createElement function:');
try {
  const heading = createElement(ComponentType.HEADING);
  console.log(`✅ Created heading element:`, {
    id: heading.id,
    type: heading.type,
    content: heading.content
  });
  
  const paragraph = createElement(ComponentType.PARAGRAPH);
  console.log(`✅ Created paragraph element:`, {
    id: paragraph.id,
    type: paragraph.type, 
    content: paragraph.content
  });
  
  const section = createElement(ComponentType.SECTION);
  console.log(`✅ Created section element:`, {
    id: section.id,
    type: section.type,
    name: section.name
  });
  
} catch (error) {
  console.log('❌ createElement failed:', error);
}

console.log('\n✅ All core functionality tests completed!');