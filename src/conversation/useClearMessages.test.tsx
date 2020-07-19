import React from 'react'
import { render, act } from '@testing-library/react'
import useSendMessage from './useSendMessage'
import {
  Message,
  MessageUser,
  ConversationProvider,
  MessageCollection,
} from './context'
import useMessages from './useMessages'
import useClearMessages from './useClearMessages'

describe('useClearMessages', () => {
  it('clears messages', () => {
    let messages: MessageCollection<unknown, Message<unknown>> | undefined
    let send: ((message: Message<unknown>) => void) | undefined
    let clear: ((timestamp: number) => void) | undefined

    const Component = () => {
      messages = useMessages()
      send = useSendMessage()
      clear = useClearMessages()

      return null
    }

    const testUserMessage: MessageUser<unknown> = {
      type: 'user',
      text: 'test',
    }

    const originalDateNow = Date.now

    act(() => {
      render(
        <ConversationProvider>
          <Component />
        </ConversationProvider>,
      )

      if (!send) {
        throw new Error('Check the correct usage of "useSendMessage"!')
      }

      let tsCounter = 0
      Date.now = () => {
        tsCounter += 1

        return tsCounter
      }

      send(testUserMessage) // ts === 4
      send(testUserMessage) // ts === 5
      send(testUserMessage) // ts === 6
    })

    expect(Object.keys(messages || {})).toHaveLength(3)

    act(() => {
      if (!clear) {
        throw new Error('Check the correct usage of "useClearMessages"!')
      }

      clear(5)
    })

    expect(Object.keys(messages || {})).toHaveLength(1)

    Date.now = originalDateNow
  })
})
