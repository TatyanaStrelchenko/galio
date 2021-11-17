import React, { useState } from 'react'

import { Space } from '../types/space'
import { createSpace } from '../services/spaces'
import { FormContainer, FormGroup } from '../components/Form/FormGroup'
import { Button } from '../components/Button/Button'
import { Input } from '../components/Input/Input'
import { Heading } from '../components/Typography/Heading'

type Props = {
  onSpaceCreated: (space: Space) => void
}

export const CreateSpaceScene = ({ onSpaceCreated }: Props) => {
  const [submitting, setSubmitting] = useState(false)
  const [spaceName, setSpaceName] = useState('')

  const handleSpaceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpaceName(e.target.value)
  }

  const handleCreateSpaceClick = async () => {
    setSubmitting(true)

    try {
      const space = await createSpace({ name: spaceName })

      onSpaceCreated(space)
    } catch (e) {
      console.log('Failed to create space', e)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <FormContainer>
      <Heading as="h3">Create your first Space!</Heading>
      <FormGroup>
        <Input
          label="Space name:"
          placeholder="Enter space name"
          value={spaceName}
          onChange={handleSpaceNameChange}
        />
      </FormGroup>
      <Button type="button" loading={submitting} onClick={handleCreateSpaceClick}>
        Create Space!
      </Button>
    </FormContainer>
  )
}
