import React, { createContext, useContext, useState, useMemo } from 'react'

const noop = () => {}

type MessageArchiveState = {
  isArchivable: boolean
  isArchived?: boolean
}
type ArchivableMessages = Record<number, MessageArchiveState>

type MessageArchiverProviderValue = {
  archivableMessages: ArchivableMessages
  setIsMessageArchivable: (messageId: number | null, state: MessageArchiveState) => void
}

const MessageArchiverContext = createContext<MessageArchiverProviderValue>({
  archivableMessages: {},
  setIsMessageArchivable: noop,
})

export const useMessageArchiver = () => {
  return useContext(MessageArchiverContext)
}

export const MessageArchiverProvider: React.FC = ({ children }) => {
  const [archivableMessages, setArchivableMessages] = useState<ArchivableMessages>({})

  const value = useMemo(
    () => ({
      archivableMessages,
      setIsMessageArchivable: (messageId: number | null, state: MessageArchiveState) => {
        if (messageId === null) {
          return
        }

        setArchivableMessages((prevArchivableMessages) => ({
          ...prevArchivableMessages,
          [messageId]: state,
        }))
      },
    }),
    [archivableMessages]
  )

  return <MessageArchiverContext.Provider value={value}>{children}</MessageArchiverContext.Provider>
}
