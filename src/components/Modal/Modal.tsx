import React from 'react'
import ReactModal, { Props as ReactModalProps } from 'react-modal'
import styled from 'styled-components'

import styles from './Modal.module.css'
import { XIcon } from '../Icons/XIcon'

const ModalHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`

const CloseIconWrapper = styled.div`
  display: flex;
  font-size: 28px;
  cursor: pointer;

  &:hover {
    opacity: 0.75;
  }
`

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    padding: '24px',
  },
}

type ModalHeaderProps = {
  children: React.ReactNode
  onClose: () => void
}

export const ModalHeader = ({ children, onClose }: ModalHeaderProps) => {
  return (
    <ModalHeaderWrapper>
      <div>{children}</div>
      <CloseIconWrapper onClick={onClose}>
        <XIcon />
      </CloseIconWrapper>
    </ModalHeaderWrapper>
  )
}

export const ModalContent = styled.div`
  margin-bottom: 24px;
`

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`

type Props = ReactModalProps & {
  children: React.ReactNode
}

export const Modal = ({ children, ...props }: Props) => {
  return (
    <ReactModal
      className={styles.modal}
      overlayClassName={styles.modalOverlay}
      style={customStyles}
      {...props}
    >
      {children}
    </ReactModal>
  )
}
