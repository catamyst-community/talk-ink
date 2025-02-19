import { KontenbaseResponse } from "@kontenbase/sdk";
import Button from "components/Button/Button";
import { updateUser } from "features/auth";
import { addChannel, updateChannel } from "features/channels/slice";
import { updateWorkspace } from "features/workspaces";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useAppSelector } from "hooks/useAppSelector";
import { useToast } from "hooks/useToast";
import { kontenbase } from "lib/client";
import React, { useMemo } from "react";
import { BsEye } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { Channel } from "types";

type Props = {
  type: "channel" | "thread";
  data: Channel;
  userId: string;
};

function ChannelBadge({ type = "channel", data, userId }: Props) {
  const [showToast] = useToast();

  const dispatch = useAppDispatch();

  const joinChannelHandler = async () => {
    try {
      const joinChannel: KontenbaseResponse<Channel> = await kontenbase
        .service("Channels")
        .link(data._id, { members: userId });

      dispatch(updateChannel({ _id: data._id, ...joinChannel.data }));
    } catch (error) {
      console.log("err", error);
      showToast({ message: `${JSON.stringify(error)}` });
    }
  };
  return (
    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 p-3 bg-slate-800 rounded-md flex items-center justify-between">
      <div className="flex items-center mr-5">
        <BsEye className="text-white mr-2" size={18} />
        <p className="text-sm text-white font-semibold max-w-xs whitespace-nowrap overflow-hidden text-ellipsis mr-1">
          You’re previewing #{data?.name}.
        </p>
        <p className="text-sm text-white">Join to reply and compose.</p>
      </div>
      <Button
        className="text-sm text-white bg-indigo-500"
        onClick={joinChannelHandler}
      >
        Join {type === "channel" ? "Channel" : "to reply"}
      </Button>
    </div>
  );
}

export default ChannelBadge;
