import React from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";

type Props = React.PropsWithChildren<{
  onClick?: () => void;
  onOptionClick?: () => void;
}>;

function ChannelButton({
  onClick = () => {},
  onOptionClick = () => {},
}: Props) {
  return (
    <div className="w-full rounded h-9 hover:bg-neutral-100 flex items-center justify-between group">
      <button className="pl-3 h-full w-full text-left" onClick={onClick}>
        <p className="font-bold text-xs text-neutral-500">Channels</p>
      </button>
      <button
        className="hidden h-7 w-8 group-hover:flex items-center justify-center hover:bg-neutral-300 rounded-md"
        onClick={onOptionClick}
      >
        <BiDotsHorizontalRounded size={18} className="text-neutral-500" />
      </button>
    </div>
  );
}

export default ChannelButton;
