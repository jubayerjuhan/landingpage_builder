import type { BuilderElement } from '../types/builder';
import { ComponentType } from '../types/builder';
import { createElement, createElementWithChildren } from './elementFactory';

/**
 * Row Management System - Utilities for managing row operations
 */

export interface RowOperations {
  addColumn: (rowElement: BuilderElement) => BuilderElement;
  removeColumn: (rowElement: BuilderElement, columnIndex: number) => BuilderElement;
  reorderColumns: (rowElement: BuilderElement, from: number, to: number) => BuilderElement;
  resizeColumns: (rowElement: BuilderElement, columnWidths: string[]) => BuilderElement;
  duplicateColumn: (rowElement: BuilderElement, columnIndex: number) => BuilderElement;
}

/**
 * Adds a new column to a row element
 */
export const addColumnToRow = (rowElement: BuilderElement): BuilderElement => {
  if (rowElement.type !== 'row') {
    throw new Error('Element must be of type "row"');
  }

  const currentColumns = rowElement.children || [];
  const newColumnCount = currentColumns.length + 1;
  const newColumnWidth = `${100 / newColumnCount}%`;

  // Create new column
  const newColumn = createElement(ComponentType.COLUMN, {
    name: `Column ${newColumnCount}`,
    properties: {
      width: newColumnWidth,
      padding: '1rem'
    },
    styles: {
      desktop: {
        width: newColumnWidth,
        padding: '1rem',
        minHeight: '100px'
      },
      tablet: {
        width: newColumnCount <= 2 ? newColumnWidth : '100%',
        marginBottom: newColumnCount > 2 ? '1rem' : '0'
      },
      mobile: {
        width: '100%',
        marginBottom: '1rem'
      }
    }
  });

  // Update existing columns widths
  const updatedColumns = currentColumns.map((column, index) => ({
    ...column,
    name: `Column ${index + 1}`,
    properties: {
      ...column.properties,
      width: newColumnWidth
    },
    styles: {
      ...column.styles,
      desktop: {
        ...column.styles.desktop,
        width: newColumnWidth
      },
      tablet: {
        ...column.styles.tablet,
        width: newColumnCount <= 2 ? newColumnWidth : '100%'
      }
    }
  }));

  // Add new column and update parent references
  const allColumns = [...updatedColumns, newColumn].map(col => ({
    ...col,
    parentId: rowElement.id
  }));

  return {
    ...rowElement,
    children: allColumns,
    name: `${newColumnCount}-Column Row`
  };
};

/**
 * Removes a column from a row element
 */
export const removeColumnFromRow = (rowElement: BuilderElement, columnIndex: number): BuilderElement => {
  if (rowElement.type !== 'row') {
    throw new Error('Element must be of type "row"');
  }

  const currentColumns = rowElement.children || [];
  
  if (columnIndex < 0 || columnIndex >= currentColumns.length) {
    throw new Error('Invalid column index');
  }

  if (currentColumns.length <= 1) {
    throw new Error('Cannot remove the last column from a row');
  }

  // Remove the column
  const updatedColumns = currentColumns.filter((_, index) => index !== columnIndex);
  const newColumnCount = updatedColumns.length;
  const newColumnWidth = `${100 / newColumnCount}%`;

  // Update remaining columns widths and names
  const rebalancedColumns = updatedColumns.map((column, index) => ({
    ...column,
    name: `Column ${index + 1}`,
    properties: {
      ...column.properties,
      width: newColumnWidth
    },
    styles: {
      ...column.styles,
      desktop: {
        ...column.styles.desktop,
        width: newColumnWidth
      },
      tablet: {
        ...column.styles.tablet,
        width: newColumnCount <= 2 ? newColumnWidth : '100%'
      }
    }
  }));

  return {
    ...rowElement,
    children: rebalancedColumns,
    name: `${newColumnCount}-Column Row`
  };
};

/**
 * Reorders columns within a row
 */
export const reorderColumnsInRow = (rowElement: BuilderElement, fromIndex: number, toIndex: number): BuilderElement => {
  if (rowElement.type !== 'row') {
    throw new Error('Element must be of type "row"');
  }

  const currentColumns = rowElement.children || [];
  
  if (fromIndex < 0 || fromIndex >= currentColumns.length || toIndex < 0 || toIndex >= currentColumns.length) {
    throw new Error('Invalid column indices');
  }

  const reorderedColumns = [...currentColumns];
  const [movedColumn] = reorderedColumns.splice(fromIndex, 1);
  reorderedColumns.splice(toIndex, 0, movedColumn);

  // Update column names to reflect new order
  const updatedColumns = reorderedColumns.map((column, index) => ({
    ...column,
    name: `Column ${index + 1}`
  }));

  return {
    ...rowElement,
    children: updatedColumns
  };
};

/**
 * Resizes columns with custom widths
 */
export const resizeColumnsInRow = (rowElement: BuilderElement, columnWidths: string[]): BuilderElement => {
  if (rowElement.type !== 'row') {
    throw new Error('Element must be of type "row"');
  }

  const currentColumns = rowElement.children || [];
  
  if (columnWidths.length !== currentColumns.length) {
    throw new Error('Number of widths must match number of columns');
  }

  const updatedColumns = currentColumns.map((column, index) => ({
    ...column,
    properties: {
      ...column.properties,
      width: columnWidths[index]
    },
    styles: {
      ...column.styles,
      desktop: {
        ...column.styles.desktop,
        width: columnWidths[index]
      }
    }
  }));

  return {
    ...rowElement,
    children: updatedColumns
  };
};

/**
 * Duplicates a column within a row
 */
export const duplicateColumnInRow = (rowElement: BuilderElement, columnIndex: number): BuilderElement => {
  if (rowElement.type !== 'row') {
    throw new Error('Element must be of type "row"');
  }

  const currentColumns = rowElement.children || [];
  
  if (columnIndex < 0 || columnIndex >= currentColumns.length) {
    throw new Error('Invalid column index');
  }

  const columnToDuplicate = currentColumns[columnIndex];
  const newColumnCount = currentColumns.length + 1;
  const newColumnWidth = `${100 / newColumnCount}%`;

  // Create duplicate with new ID
  const duplicatedColumn = {
    ...JSON.parse(JSON.stringify(columnToDuplicate)), // Deep clone
    id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: `${columnToDuplicate.name} Copy`,
    parentId: rowElement.id
  };

  // Insert duplicate after original column
  const updatedColumns = [
    ...currentColumns.slice(0, columnIndex + 1),
    duplicatedColumn,
    ...currentColumns.slice(columnIndex + 1)
  ];

  // Rebalance all column widths and update names
  const rebalancedColumns = updatedColumns.map((column, index) => ({
    ...column,
    name: index === columnIndex + 1 ? `${currentColumns[columnIndex].name} Copy` : `Column ${index + 1}`,
    properties: {
      ...column.properties,
      width: newColumnWidth
    },
    styles: {
      ...column.styles,
      desktop: {
        ...column.styles.desktop,
        width: newColumnWidth
      },
      tablet: {
        ...column.styles.tablet,
        width: newColumnCount <= 2 ? newColumnWidth : '100%'
      }
    }
  }));

  return {
    ...rowElement,
    children: rebalancedColumns,
    name: `${newColumnCount}-Column Row`
  };
};

/**
 * Gets column statistics for a row
 */
export const getRowStats = (rowElement: BuilderElement) => {
  if (rowElement.type !== 'row') {
    return null;
  }

  const columns = rowElement.children || [];
  const totalElements = columns.reduce((sum, col) => sum + (col.children?.length || 0), 0);

  return {
    columnCount: columns.length,
    totalElements,
    isEmpty: totalElements === 0,
    distribution: columns.map(col => ({
      name: col.name || 'Untitled Column',
      elementCount: col.children?.length || 0,
      width: col.properties?.width || 'auto'
    }))
  };
};

/**
 * Row management operations object
 */
export const rowManager: RowOperations = {
  addColumn: addColumnToRow,
  removeColumn: removeColumnFromRow,
  reorderColumns: reorderColumnsInRow,
  resizeColumns: resizeColumnsInRow,
  duplicateColumn: duplicateColumnInRow
};