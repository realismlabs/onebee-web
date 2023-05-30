
import { Table } from '@phosphor-icons/react'
import Image from 'next/image';

export const IconLoaderFromSvgString = ({ iconSvgBase64Url }) => {
  if (typeof iconSvgBase64Url === "string") {
    return (
      <div className="flex items-center justify-center h-[20px] w-[20px] rounded cursor-pointer">
        <Image src={iconSvgBase64Url} width={20} height={20} alt="table icon" />
      </div>
    );
  } else {
    return <Table size={20} weight="fill" />;
  }
};