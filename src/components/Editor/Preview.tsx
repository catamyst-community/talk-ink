import React, { useEffect, useState } from "react";

import Editor from "rich-markdown-editor";

import Button from "components/Button/Button";

import { kontenbase } from "lib/client";

interface IProps {
  content: string;
  isEdit: boolean;
  setEditorState: React.Dispatch<React.SetStateAction<string>>;
  discardComment: () => void;
  handleUpdateComment: () => void;
}

type PropsDelay = React.PropsWithChildren<{
  waitBeforeShow?: number;
}>;

const Delayed = ({ children, waitBeforeShow = 100 }: PropsDelay) => {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const timer = () =>
      setTimeout(() => {
        setIsShown(true);
      }, waitBeforeShow);

    const timerId = timer();

    return () => {
      clearTimeout(timerId);
    };
  }, [waitBeforeShow]);

  return isShown ? <>{children}</> : null;
};

const Preview: React.FC<IProps> = ({
  content,
  isEdit,
  setEditorState,
  discardComment,
  handleUpdateComment,
}) => {
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  return typeof content === "string" && !isEdit ? (
    <Delayed waitBeforeShow={100}>
      <Editor
        key="preview"
        value={content}
        readOnly
        className="markdown-overrides fix-editor"
      />
    </Delayed>
  ) : (
    <div className="px-2 border-solid border-2 border-light-blue-500 rounded-md ">
      <Editor
        key="edited"
        defaultValue={content}
        className="markdown-overrides"
        onChange={(getContent: () => string) => setEditorState(getContent())}
        autoFocus
        uploadImage={async (file: File) => {
          setImageLoading(true);
          const { data } = await kontenbase.storage.upload(file);
          setImageLoading(false);
          return data.url;
        }}
      />
      <div className="flex justify-between">
        icon
        <div className="flex items-center py-2">
          <Button
            type="submit"
            className="mr-3 text-sm flex items-center justify-center bg-indigo-100 min-w-[5rem] text-black"
            onClick={discardComment}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="text-sm flex items-center justify-center bg-indigo-500 min-w-[5rem] text-white"
            onClick={handleUpdateComment}
            disabled={imageLoading}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Preview;
