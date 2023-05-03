import parse from 'html-react-parser';
import { Table } from '@phosphor-icons/react'

export const IconLoaderFromSvgString = ({ iconSvgString, tableName = null }) => {
  if (typeof iconSvgString === "string") {
    return (
      <div className="flex items-center justify-center h-[20px] w-[20px] rounded cursor-pointer">
        {parse(iconSvgString)}
      </div>
    );
  } else {
    return <Table size={20} weight="fill" />;
  }
};