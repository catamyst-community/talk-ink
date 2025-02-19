import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Thread, IComment } from "types";
import { fetchComments, fetchThreads } from "./asyncThunk";

type InitThreadState = {
  threads: Thread[];
  loading: boolean;
  commentLoading: boolean;
};

type TCommentsPayload = {
  comments: IComment[];
  threadId: string;
};

type TCommentPayload = {
  comment: IComment;
  threadId: string;
};

type TDeleteCommentPayload = {
  deletedId: string;
  threadId: string;
};

type TInteractedUserPayload = {
  userId: string;
  threadId: string;
};

const initialState: InitThreadState = {
  threads: [],
  loading: true,
  commentLoading: true,
};

const threadSlice = createSlice({
  name: "thread",
  initialState,
  reducers: {
    addThread: (state, action: PayloadAction<Thread>) => {
      state.threads.push(action.payload);
    },
    deleteThread: (state, action: PayloadAction<Thread>) => {
      let deletedIndex = state.threads.findIndex(
        (data) => data._id === action.payload._id
      );
      state.threads.splice(deletedIndex, 1);
    },
    addComment: (state, action: PayloadAction<TCommentPayload>) => {
      const newThread = state.threads.map((item) =>
        item._id === action.payload.threadId
          ? {
              ...item,
              comments: [...item.comments, action.payload.comment],
            }
          : item
      );

      state.threads = newThread;
    },
    updateComment: (state, action: PayloadAction<TCommentPayload>) => {
      console.log(action.payload);

      const updatedThread = state.threads.map((item) =>
        item._id === action.payload.threadId
          ? {
              ...item,
              comments: item.comments.map((comment) =>
                comment._id === action.payload.comment._id
                  ? action.payload.comment
                  : comment
              ),
            }
          : item
      );

      state.threads = updatedThread;
    },
    deleteComment: (state, action: PayloadAction<TDeleteCommentPayload>) => {
      const filteredThread = state.threads.map((item) =>
        item._id === action.payload.threadId
          ? {
              ...item,
              comments: item.comments.filter(
                (comment) => comment._id !== action.payload.deletedId
              ),
            }
          : item
      );

      state.threads = filteredThread;
    },
    addInteractedUser: (
      state,
      action: PayloadAction<TInteractedUserPayload>
    ) => {
      const newThread = state.threads.map((item) =>
        item._id === action.payload.threadId
          ? {
              ...item,
              interactedUsers: item.interactedUsers
                ? [...item.interactedUsers, action.payload.userId]
                : [action.payload.userId],
            }
          : item
      );

      state.threads = newThread;
    },
  },
  extraReducers: (builder) => {
    //fetch thread
    builder.addCase(fetchThreads.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchThreads.fulfilled,
      (state, action: PayloadAction<Thread[]>) => {
        state.threads = action.payload;
        state.loading = false;
      }
    );
    builder.addCase(fetchThreads.rejected, (state) => {
      state.loading = false;
    });

    //fetch comment
    builder.addCase(fetchComments.pending, (state) => {
      state.commentLoading = true;
    });
    builder.addCase(
      fetchComments.fulfilled,
      (state, action: PayloadAction<TCommentsPayload>) => {
        const newThread = state.threads.map((item) =>
          item._id === action.payload.threadId
            ? {
                ...item,
                comments: action.payload.comments,
              }
            : item
        );

        state.threads = newThread;
        state.commentLoading = false;
      }
    );
    builder.addCase(fetchComments.rejected, (state) => {
      state.commentLoading = false;
    });
  },
});

export const {
  addThread,
  deleteThread,
  addComment,
  deleteComment,
  updateComment,
  addInteractedUser,
} = threadSlice.actions;
export const threadReducer = threadSlice.reducer;
