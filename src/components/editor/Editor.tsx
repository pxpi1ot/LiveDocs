"use client";

import Theme from "./plugins/Theme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { HeadingNode } from "@lexical/rich-text";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import React from "react";
import {
	FloatingComposer,
	FloatingThreads,
	liveblocksConfig,
	LiveblocksPlugin,
	useIsEditorReady,
} from "@liveblocks/react-lexical";
import { DeleteModal } from "../DeleteModal";
import { useThreads } from "@liveblocks/react";
import Loader from "../Loader";
import FloatingToolbarPlugin from "./plugins/FloatingToolbarPlugin";
import Comments from "../Comments";
import { LiveblocksUIConfig, Thread } from "@liveblocks/react-ui";
// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.

function Placeholder() {
	return <div className="editor-placeholder">输入文档内容...</div>;
}

export function Editor({
	roomId,
	currentUserType,
}: {
	roomId: string;
	currentUserType: UserType;
}) {
	const isReady = useIsEditorReady();
	const { threads } = useThreads();

	const initialConfig = liveblocksConfig({
		namespace: "Editor",
		nodes: [HeadingNode],
		onError: (error: Error) => {
			console.error(error);
			throw error;
		},
		theme: Theme,
		editable: currentUserType === "editor",
	});

	return (
		<LexicalComposer initialConfig={initialConfig}>
			<div className="editor-container size-full">
				<div className="toolbar-wrapper flex min-w-full justify-between">
					<ToolbarPlugin />
					{currentUserType === "editor" && <DeleteModal roomId={roomId} />}
				</div>

				<div className="editor-wrapper flex flex-col items-center justify-start">
					{!isReady ? (
						<Loader />
					) : (
						<div className="shadow-sm editor-inner min-h-[1100px] relative mb-5 h-fit w-full max-w-[800px]  lg:mb-10">
							<RichTextPlugin
								contentEditable={
									<ContentEditable className="editor-input h-full" />
								}
								placeholder={<Placeholder />}
								ErrorBoundary={LexicalErrorBoundary}
							/>
							{currentUserType === "editor" && <FloatingToolbarPlugin />}
							<HistoryPlugin />
							<AutoFocusPlugin />
						</div>
					)}

					<LiveblocksPlugin>
						<LiveblocksUIConfig overrides={{ locale: "zh-CN" }}>
							<FloatingComposer
								className="w-[350px]"
								overrides={{
									COMPOSER_PLACEHOLDER: "输入评论内容...",
									EMOJI_PICKER_SEARCH_PLACEHOLDER: "搜索",
									EMOJI_PICKER_EMPTY: "没有找到表情",
								}}
							/>
							<FloatingThreads
								threads={threads!}
								components={{
									Thread: props => (
										<Thread
											{...props}
											className="border shadow"
											style={{ width: "300px" }}
											overrides={{
												THREAD_COMPOSER_PLACEHOLDER: "回复",
												EMOJI_PICKER_SEARCH_PLACEHOLDER: "搜索",
											}}
										/>
									),
								}}
							/>

							<Comments />
						</LiveblocksUIConfig>
					</LiveblocksPlugin>
				</div>
			</div>
		</LexicalComposer>
	);
}
