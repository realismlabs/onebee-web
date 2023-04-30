import { Command } from 'cmdk'
import React, { useRef } from 'react';
import { Transition } from '@headlessui/react';

export const CommandBar = () => {

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('connections')

  // Toggle the menu when ⌘K is pressed
  React.useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && e.metaKey) {
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <>
      {open && (
        <Command.Dialog
          data-state={open ? 'open' : 'closed'}
          open={open}
          onOpenChange={setOpen}
          value={value}
          onValueChange={(v) => {
            console.log('value', v)
            setValue(v)
          }}
          label="Global Command Menu"
          className="absolute inset-0  left-[50%] translate-x-[-50%] top-[25%] translate-y-[-25%] max-h-[40vh] overflow-y-auto bg-[#101112] text-white shadow-2xl text-[14px] rounded-xl data-[state=open]:animate-contentShowNoPosition">
          <div className={`command-dialog-content ${open ? 'open' : ''}`}>
            <div className="sticky top-0 flex flex-col border-b border-slate-4 px-[16px] pt-[12px] bg-[#101112]">
              <div cmdk-linear-badge="" className="text-[13px] text-slate-11 px-[6px] py-[3px] rounded-md bg-slate-2 w-fit">Home</div>
              <Command.Input autoFocus placeholder="Type a command or search..."
                className="bg-[#101112] w-full border-none text-[14px] focus:outline-none focus:ring-0 px-[0px]"
              />
            </div>
            <div className="mx-[6px]">
              <Command.List>
                <Command.Empty>No results found.</Command.Empty>
                {items.map(({ label, shortcut }) => {
                  return (
                    <Command.Item
                      key={label}
                      value={label}
                      className={`focus:border focus:border-white ${value === label.toLocaleLowerCase() ? "bg-slate-2" : ""} flex flex-row py-2 px-[10px] rounded-[4px]`}>
                      {label}
                      <div cmdk-linear-shortcuts="">
                        {shortcut.map((key) => {
                          return <kbd key={key}>{key}</kbd>
                        })}
                      </div>
                    </Command.Item>
                  )
                })}
              </Command.List>
            </div>
          </div>
        </Command.Dialog>
      )}
    </>
  )
}

export default CommandBar

const items = [
  {
    label: 'Connections',
    shortcut: ['A'],
  },
  {
    label: 'Assign to me',
    shortcut: ['I'],
  },
  {
    label: 'Change status...',
    shortcut: ['S'],
  },
  {
    label: 'Change priority...',
    shortcut: ['P'],
  },
  {
    label: 'Change labels...',
    shortcut: ['L'],
  },
  {
    label: 'Remove label...',
    shortcut: ['⇧', 'L'],
  },
  {
    label: 'Set due date...',
    shortcut: ['⇧', 'D'],
  },
]
