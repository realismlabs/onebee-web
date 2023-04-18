import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

const WordTooltipDemo = ({ display_text, tooltip_content }) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className="text-white border-b border-white border-dotted text-xs">
            {display_text}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="text-white text-[12px] rounded-[4px] bg-slate-3 px-4 py-3"
            sideOffset={12}
            side="left"
          >
            {tooltip_content}
            <Tooltip.Arrow className="fill-slate-4" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default WordTooltipDemo;