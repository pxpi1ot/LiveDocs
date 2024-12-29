import { cn } from "@/lib/utils";
import { useIsThreadActive } from "@liveblocks/react-lexical";
import { Composer, Thread } from "@liveblocks/react-ui";
import { useThreads } from "@liveblocks/react/suspense";
import React from "react";

const ThreadWrapper = ({ thread }: ThreadWrapperProps) => {
	const isActive = useIsThreadActive(thread.id);

	return (
		<Thread
			overrides={{
				THREAD_COMPOSER_PLACEHOLDER: "回复",
			}}
			thread={thread}
			data-state={isActive ? "active" : null}
			className={cn(
				"comment-thread  ",
				isActive && "border !border-emerald-400 shadow-md",
				thread.resolved && "opacity-40"
			)}
		/>
	);
};

const Comments = () => {
	const { threads } = useThreads();

	return (
		<div className="comments-container">
			<Composer
				className="comment-composer"
				overrides={{
					COMPOSER_PLACEHOLDER: "输入评论内容...",
					EMOJI_PICKER_SEARCH_PLACEHOLDER: "搜索",
					EMOJI_PICKER_EMPTY: "没有找到表情",
				}}
			/>

			{threads.map(thread => (
				<ThreadWrapper key={thread.id} thread={thread} />
			))}
		</div>
	);
};

export default Comments;
