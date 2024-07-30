//
// Copyright IBM Corp. 2024, 2024
//
// This source code is licensed under the Apache-2.0 license found in the
// LICENSE file in the root directory of this source tree.
//

import React, { ReactNode, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {
  ComposedModal,
  ModalHeader,
  ModalBody,
  Search,
  Tag,
} from '@carbon/react';

import { pkg } from '../../settings';
import { prepareProps } from '../../global/js/utils/props-helper';
import { usePortalTarget } from '../../global/js/hooks/usePortalTarget';

const componentName = 'TagOverflowModal';
const blockClass = `${pkg.prefix}--tag-overflow-modal`;

// Default values for props
const defaults = {
  // marked as required by TagSet if needed, default used to satisfy <Search /> component
  searchLabel: '',
};

interface TagType {
  label: string;
}
type AllTags = (TagType & Omit<React.ComponentProps<Tag>, 'filter'>)[];
interface TagOverflowModalProps {
  allTags?: AllTags;
  className?: string;
  onClose?: () => void;
  open?: boolean;
  overflowType?: 'default' | 'tag';
  portalTarget?: ReactNode;
  searchLabel?: string;
  searchPlaceholder?: string;
  title?: string;
}

export const TagOverflowModal = ({
  // The component props, in alphabetical order (for consistency).

  allTags,
  className,
  title,
  onClose,
  open,
  overflowType,
  portalTarget: portalTargetIn,
  searchLabel = defaults.searchLabel,
  searchPlaceholder,

  // Collect any other property values passed in.
  ...rest
}: TagOverflowModalProps) => {
  const [search, setSearch] = useState('');
  const renderPortalUse = usePortalTarget(portalTargetIn);

  const getFilteredItems = (): AllTags => {
    if (open && search && allTags) {
      return allTags.filter((tag) =>
        tag.label?.toLocaleLowerCase()?.includes(search.toLocaleLowerCase())
      );
    }
    return allTags || [];
  };

  const handleSearch = (evt) => {
    setSearch(evt.target.value || '');
  };

  return renderPortalUse(
    <ComposedModal
      {
        // Pass through any other property values as HTML attributes.
        ...rest
      }
      containerClassName={`${blockClass}__container`}
      className={cx(className, blockClass)}
      size="sm"
      aria-label="Search all"
      {...{ open, onClose }}
    >
      <ModalHeader
        className={`${blockClass}__header`}
        closeModal={onClose}
        title={title}
      >
        <Search
          data-modal-primary-focus
          className={`${blockClass}__search`}
          labelText={searchLabel}
          placeholder={searchPlaceholder}
          onChange={handleSearch}
          size="lg"
        />
      </ModalHeader>
      <ModalBody className={`${blockClass}__body`} hasForm>
        {getFilteredItems().map(({ label, id, filter }) => {
          const isFilterable = overflowType === 'tag' ? filter : false;
          return (
            <Tag key={id} filter={isFilterable}>
              {label}
            </Tag>
          );
        })}
      </ModalBody>
      <div className={`${blockClass}__fade`} />
    </ComposedModal>
  );
};

TagOverflowModal.propTypes = {
  allTags: PropTypes.arrayOf(
    PropTypes.shape({
      ...prepareProps(Tag.propTypes, 'filter'),
      label: PropTypes.string.isRequired,
    })
  ),
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  overflowType: PropTypes.oneOf(['default', 'tag']),
  portalTarget: PropTypes.node,
  searchLabel: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  title: PropTypes.string,
};

TagOverflowModal.displayName = componentName;
