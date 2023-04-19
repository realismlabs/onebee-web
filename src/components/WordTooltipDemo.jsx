import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

const WordTooltipDemo = ({ display_text, tooltip_content }) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className="text-white border-b border-white border-dotted text-xs text-left" tabIndex={-1}>
            {display_text}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="text-white text-[11px] rounded-[4px] bg-slate-2 px-4 py-3 z-20 shadow-2xl"
            sideOffset={12}
            side="left"
          >
            {tooltip_content}
            <Tooltip.Arrow className="fill-slate-2" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default WordTooltipDemo;