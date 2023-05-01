import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

const WordTooltipDemo = ({ display_text, tooltip_content }) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className="text-slate-12 border-b border-slate-11 border-dotted text-[13px] text-left" tabIndex={-1}>
            {display_text}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="text-slate-12 text-[11px] rounded-[4px] bg-black px-4 py-3 z-20 shadow-2xl"
            sideOffset={12}
            side="left"
          >
            {tooltip_content}
            <Tooltip.Arrow className="fill-black" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default WordTooltipDemo;