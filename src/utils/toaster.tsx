import { toast, ToastContainer } from 'react-toastify'
import styled from 'styled-components'
import { CopyIcon } from '../components/Icons/CopyIcon'

export const ToastBody = styled.div`
  display: flex;
  align-items: center;
`

export const ToastMessage = styled.div`
  margin-left: 8px;
  justify-content: center;
`

export const StyledToastContainer = styled(ToastContainer).attrs({
  className: 'toast-container',
  toastClassName: 'toast',
  bodyClassName: 'body',
})`
  /* .toast-container */
  left: 8px;
  bottom: 8px;
  width: 245px;
  transform: none;

  /* .toast is passed to toastClassName */
  .toast {
    width: 100%;
    height: 100%;
    background: #ffffff;
    border-radius: 4px;
    color: #308575;
    min-height: 40px;
    text-align: center;
    margin: 10px 0 0;
    font-size: 14px;
    box-shadow: none;
  }

  button[aria-label='close'] {
    display: none;
  }
`

const toaster = (type: string, message: string) => {
  switch (type) {
    case 'warning':
      return toast.warning(message)
    case 'error':
      return toast.error(message)
    case 'success':
      return toast.success(
        <ToastBody>
          <CopyIcon />
          <ToastMessage>{message}</ToastMessage>
        </ToastBody>
      )
    case 'info':
      return toast.info(message)
    case 'dark':
      return toast.dark(message)
    default:
      return toast(message)
  }
}

export default toaster
