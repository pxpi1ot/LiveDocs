"use client";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	InboxNotification,
	InboxNotificationList,
	LiveblocksUIConfig,
} from "@liveblocks/react-ui";
import {
	useInboxNotifications,
	useUnreadInboxNotificationsCount,
} from "@liveblocks/react/suspense";
import Image from "next/image";
import { ReactNode } from "react";

const Notifications = () => {
	const { inboxNotifications } = useInboxNotifications();
	const { count } = useUnreadInboxNotificationsCount();

	const unreadNotifications = inboxNotifications.filter(
		notification => !notification.readAt
	);

	return (
		<Popover>
			<PopoverTrigger className="relative flex size-10 items-center justify-center rounded-lg">
				<Image
					src="/assets/icons/bell.svg"
					alt="inbox"
					width={24}
					height={24}
				/>
				{count > 0 && (
					<div className="absolute right-2 top-2 z-20 size-2 rounded-full bg-red-500" />
				)}
			</PopoverTrigger>
			<PopoverContent align="end" className="shad-popover">
				<LiveblocksUIConfig
					overrides={{
						locale: "zh-CN",
					}}
				>
					<InboxNotificationList>
						{unreadNotifications.length <= 0 && (
							<p className="py-2 text-center text-slate-500">没有新通知</p>
						)}

						{unreadNotifications.length > 0 &&
							unreadNotifications.map(notification => (
								<InboxNotification
									key={notification.id}
									inboxNotification={notification}
									className=" "
									href={`/documents/${notification.roomId}`}
									showActions={false}
									kinds={{
										thread: props => (
											<InboxNotification.Thread
												{...props}
												showActions={false}
												showRoomName={false}
											/>
										),
										textMention: props => (
											<InboxNotification.TextMention
												{...props}
												showRoomName={false}
												overrides={{}}
											/>
										),
										$documentAccess: props => (
											<InboxNotification.Custom
												{...props}
												title={props.inboxNotification.activities[0].data.title}
												aside={
													<InboxNotification.Icon className="">
														<Image
															src={
																(props.inboxNotification.activities[0].data
																	.avatar as string) || ""
															}
															width={36}
															height={36}
															alt="avatar"
															className="rounded-full"
														/>
													</InboxNotification.Icon>
												}
											>
												{props.children}
											</InboxNotification.Custom>
										),
									}}
								/>
							))}
					</InboxNotificationList>
				</LiveblocksUIConfig>
			</PopoverContent>
		</Popover>
	);
};

export default Notifications;
