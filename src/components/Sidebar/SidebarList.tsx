import IconButton from "components/Button/IconButton";
import Menu from "components/Menu/Menu";
import MenuItem from "components/Menu/MenuItem";
import Popup from "components/Popup/Popup";
import React, { Dispatch, SetStateAction, useMemo } from "react";

import { AiOutlineInbox, AiOutlineSearch } from "react-icons/ai";
import {
  BiDotsHorizontalRounded,
  BiEditAlt,
  BiInfoCircle,
  BiLock,
  BiLogOut,
} from "react-icons/bi";
import {
  HiOutlineBookmark,
  HiOutlineChat,
  HiOutlineHashtag,
} from "react-icons/hi";
import { NavLink, useLocation, useParams } from "react-router-dom";

import { Channel } from "types";

type SidebarType = "search" | "inbox" | "saved" | "messages" | "channel";

type Props = React.PropsWithChildren<{
  type: SidebarType;
  name?: string;
  link: string;
  isDefault?: boolean;
  count?: number | string;
  leaveModalHandler?: (channel: Channel) => void;
  editModalHandler?: (channel: Channel) => void;
  channelInfoHandler?: (channel: Channel) => void;
  data?: Channel;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}>;

function SidebarList({
  type,
  name,
  link,
  isDefault,
  count,
  leaveModalHandler,
  editModalHandler,
  data,
  setIsSidebarOpen,
  channelInfoHandler,
}: Props) {
  let Icon = AiOutlineInbox;
  let showOption = type === "channel";

  const params = useParams();
  const { pathname } = useLocation();

  let isActive = useMemo(() => {
    if (!data) {
      return pathname.includes(type);
    } else {
      return params.channelId === data?._id;
    }
  }, [params, pathname]);

  switch (type) {
    case "search":
      Icon = AiOutlineSearch;
      break;

    case "inbox":
      Icon = AiOutlineInbox;
      break;
    case "saved":
      Icon = HiOutlineBookmark;
      break;
    case "messages":
      Icon = HiOutlineChat;
      break;
    case "channel":
      Icon = HiOutlineHashtag;
      break;

    default:
      Icon = AiOutlineInbox;
      break;
  }
  return (
    <div
      className={`cursor-pointer w-full ${
        isActive && "bg-indigo-100"
      } rounded hover:bg-neutral-100 flex items-center justify-between group`}
    >
      <NavLink
        to={link}
        className={({ isActive }) =>
          `w-full flex items-center text-sm pl-3 h-8`
        }
        onClick={() => setIsSidebarOpen(false)}
      >
        <Icon
          size={20}
          className={`mr-2 text-gray-400 ${
            type === "channel" && isDefault && "text-cyan-500"
          }`}
        />
        <p className="max-w-[150px] whitespace-nowrap overflow-hidden text-ellipsis">
          {name}
        </p>
        {data?.privacy === "private" && (
          <BiLock size={16} className={`ml-2 text-gray-400`} />
        )}
      </NavLink>
      <div
        className={`h-7 w-8 flex items-center justify-center ${
          showOption && "group-hover:hidden"
        }`}
      >
        <p className="text-neutral-400 text-xs">{count}</p>
      </div>
      {showOption && (
        <Popup
          content={
            <div>
              <Menu>
                <MenuItem
                  icon={<BiInfoCircle size={20} className="text-neutral-400" />}
                  onClick={() => {
                    channelInfoHandler(data);
                  }}
                  title="Channel information"
                />
                <MenuItem
                  icon={<BiEditAlt size={20} className="text-neutral-400" />}
                  onClick={() => {
                    editModalHandler(data);
                  }}
                  title="Edit channel"
                />
                <MenuItem
                  icon={<BiLogOut size={20} className="text-neutral-400" />}
                  onClick={() => {
                    leaveModalHandler(data);
                  }}
                  title="Leave channel"
                />
              </Menu>
            </div>
          }
          position="bottom"
        >
          <IconButton className="hidden group-hover:flex" size="medium">
            <BiDotsHorizontalRounded size={18} className="text-neutral-500" />
          </IconButton>
        </Popup>
      )}
    </div>
  );
}

export default SidebarList;
