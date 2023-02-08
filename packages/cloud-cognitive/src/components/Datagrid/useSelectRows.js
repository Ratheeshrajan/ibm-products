/*
 * Licensed Materials - Property of IBM
 * 5724-Q36
 * (c) Copyright IBM Corp. 2020
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 */
// @flow
import React from 'react';
import cx from 'classnames';
import { DataTable } from '@carbon/react';
import { SelectAll } from './Datagrid/DatagridSelectAll';
import { selectionColumnId } from './common-column-ids';
import { pkg, carbon } from '../../settings';
const { TableSelectRow } = DataTable;

const blockClass = `${pkg.prefix}--datagrid`;

const useSelectRows = (hooks) => {
  useHighlightSelection(hooks);
  const useInstance = (instance) => {
    const { rows } = instance;
    const rowsWithSelect = rows.map((row) => ({ ...row, isSelectable: true }));
    Object.assign(instance, { rows: rowsWithSelect });
  };
  hooks.useInstance.push(useInstance);
  hooks.useInstance.push((instance) => {
    Object.assign(instance, {
      withSelectRows: true,
    });
  });
  hooks.visibleColumns.push((columns) => [
    columns[0],
    {
      id: selectionColumnId,
      Header: (gridState) => <SelectAll {...gridState} />,
      Cell: (gridState) => <SelectRow {...gridState} />,
      sticky: columns[0]?.sticky === 'left' ? 'left' : null,
      selectColumn: true,
    },
    ...columns.slice(1),
  ]);
};

const useHighlightSelection = (hooks) => {
  const getRowProps = (props, { row }) => [
    props,
    {
      className: cx(
        `${blockClass}__carbon-row`,
        row.getToggleRowSelectedProps().checked
          ? `${carbon.prefix}--data-table--selected ${blockClass}__active-row`
          : ''
      ),
    },
  ];
  hooks.getRowProps.push(getRowProps);
};

const SelectRow = (datagridState) => {
  const {
    isFetching = false,
    tableId,
    row,
    cell,
    radio,
    toggleAllRowsSelected,
    onRadioSelect,
    columns,
    withStickyColumn,
    withSelectRows,
  } = datagridState;
  const selectDisabled = isFetching || row.getRowProps().selectDisabled;
  const { onChange, ...selectProps } = row.getToggleRowSelectedProps();
  const cellProps = cell.getCellProps();
  const isFirstColumnStickyLeft =
    columns[0]?.sticky === 'left' &&
    !(columns[1]?.sticky === 'left') &&
    withStickyColumn;
  return (
    <TableSelectRow
      {...cellProps}
      {...selectProps}
      radio={radio}
      onSelect={(e) => {
        e.stopPropagation(); // avoid triggering onRowClick
        if (radio) {
          toggleAllRowsSelected(false);
          if (onRadioSelect) {
            onRadioSelect(row);
          }
        }
        onChange(e);
      }}
      id={`${tableId}-${row.index}`}
      name={`${tableId}-${row.index}-name`}
      className={cx(
        `${blockClass}__checkbox-cell`,
        `${blockClass}__cell`,
        cellProps.className,
        {
          [`${blockClass}__left-sticky-column--sticky-border`]:
            isFirstColumnStickyLeft,
          [`${blockClass}__extra-select-column`]: withSelectRows,
        }
      )}
      ariaLabel={`${tableId}-row-${row.index}`} // TODO: aria label should be i18n'ed
      disabled={selectDisabled}
    />
  );
};

export default useSelectRows;
