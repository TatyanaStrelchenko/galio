import React from 'react'
import { FormikProps, FieldProps, withFormik, Form, Field } from 'formik'

import { Input } from '../Input/Input'
import styled from 'styled-components'
import { CameraVideoIcon } from '../Icons/CameraVideoIcon'

const FormAdd = styled(Form)`
  position: relative;
  display: flex;
`

const InputHolder = styled.div`
  display: flex;
  align-items: center;
  color: #464646;
  font-size: 18px;
  padding: 6px 0 6px 38px;
`

const InputCustom = styled(Input)`
  background: transparent;
  border: none;
  color: #464646;
  opacity: 1;
  padding: 0 8px;
  height: auto;

  ::placeholder {
    color: #b9bebd;
  }

  &:focus {
    background: transparent;
  }
`

const InputComponent: React.FC<FieldProps> = ({ field, form, meta, ...props }) => {
  const error = form.errors[field.name] as string
  const isTouched = form.touched[field.name] as boolean
  const message = (isTouched && error) as string

  return <InputCustom message={message} messageVariant="danger" {...field} {...props} />
}
export type Values = {
  name: string
}

type Props = {
  onSubmit: (values: Values) => void
  originValues: Values
  setSubmitFormOnBlur: boolean
  isExternal?: boolean
}

const AddChannelFormView = ({
  submitForm,
  originValues,
  setSubmitFormOnBlur,
  isExternal,
}: Props & FormikProps<Values>) => {
  const handleBlur = setSubmitFormOnBlur && submitForm

  return (
    <FormAdd>
      <InputHolder className="input-holder">
        <CameraVideoIcon fill={isExternal ? 'none' : 'currentColor'} />
        <Field
          autoFocus
          onBlur={handleBlur}
          name="name"
          component={InputComponent}
          className="input-custom"
          placeholder={originValues.name || ''}
        />
      </InputHolder>
    </FormAdd>
  )
}

export const AddChannelForm = withFormik<Props, Values>({
  mapPropsToValues: (props) => ({
    name: '',
  }),

  handleSubmit: async (values, formikBag) => {
    try {
      const finalValues = values.name.trim()
        ? values
        : {
            name: formikBag.props.originValues.name,
          }
      await formikBag.props.onSubmit(finalValues)
    } finally {
      formikBag.setSubmitting(false)
    }
  },
})(AddChannelFormView)
