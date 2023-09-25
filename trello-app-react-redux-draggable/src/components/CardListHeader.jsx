import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { CardListHeader as StyledCardListHeader } from '../styles/CardList.styles';
import ContentEditable from './ContentEditable';
import IconButton from './IconButton.jsx';

const CardListHeader = props => {
  const ref = useRef(null);
  const [onHover, setOnHover] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [listName, setListName] = useState(props.listName);
  useEffect(() => {
    setListName(props.listName);
  }, [props.listName]);

  const onClickSaveEdit = () => {
    if (editMode) {
      props.onChangeListName(listName);
    }
    setEditMode(isEditing => !isEditing);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.stopPropagation();
      e.preventDefault();
      setEditMode(false);
      ref.current.blur();
      const name = ref.current.innerText;
      props.onChangeListName(name);
    }
  };
  return (
      <StyledCardListHeader
        onMouseEnter={() => setOnHover(true)}
        onMouseLeave={() => setOnHover(false)}
      >
        <ContentEditable
          innerRef={ref}
          html={listName}
          onChange={e => setListName(e.target.value)}
          onFocus={() => setEditMode(true)}
          onKeyDown={handleKeyDown}
          style={{ paddingRight: 24 }}
        />
        {(onHover || editMode) && (
          <IconButton.ButtonContainer
            top="11px"
            right={editMode ? '11px' : '42px'}
          >
            <IconButton
              onClick={onClickSaveEdit}
              iconType={editMode ? 'confirm' : 'edit'}
            />
          </IconButton.ButtonContainer>
        )}
        {onHover && !editMode && (
          <>
            <IconButton.ButtonContainer
              top="11px"
              right="22px"
            >
             
            </IconButton.ButtonContainer>
            <IconButton.ButtonContainer
              top="11px"
              right="3px"
            >
              <IconButton
                onClick={props.onRemoveList}
                iconType="delete"
              />
            </IconButton.ButtonContainer>
          </>
        )}
      </StyledCardListHeader>
  );
};

CardListHeader.propTypes = {
  listName: PropTypes.string,
  onChangeListName: PropTypes.func,
  onRemoveList: PropTypes.func,
};

export default CardListHeader;
