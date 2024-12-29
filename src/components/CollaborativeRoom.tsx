"use client";

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react";
import Header from "./Header";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Editor } from "./editor/Editor";
import Loader from "./Loader";
import ActiveCollaborators from "./ActiveCollaborators";
import { useEffect, useRef, useState } from "react";
import { updateDocument } from "@/lib/actions/room.actions";
import { Input } from "./ui/input";

import { ChevronLeftIcon, EditIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import ShareModal from "./ShareModal";
import { currentUser } from "@clerk/nextjs/server";

const CollaborativeRoom = ({
	roomId,
	roomMetadata,
	users,
	currentUserType,
}: CollaborativeRoomProps) => {
	// 本地存储 title，防止 room Metadata.title更新慢导致Title不变还是会更新。
	const [localTitle, setLocalTitle] = useState(roomMetadata.title);
	const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);
	const [editing, setEditing] = useState(false);
	const [loading, setLoading] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const updateTitleHandler = async (
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (e.key === "Enter") {
			setLoading(true);

			try {
				if (documentTitle !== localTitle) {
					const updatedDocument = await updateDocument(roomId, documentTitle);

					if (updatedDocument) {
						setEditing(false);

						setLocalTitle(documentTitle); // 更新本地存储的 title
					}
				}
			} catch (error) {
				console.error(error);
			}

			setLoading(false);
		}
	};

	// 监听鼠标点击输入框外
	useEffect(() => {
		const handleClickOutside = async (e: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node) &&
				editing
			) {
				try {
					if (documentTitle !== localTitle) {
						setLoading(true);

						//防止loading 时 重复点击触发请求
						document.removeEventListener("mousedown", handleClickOutside);

						const updatedDocument = await updateDocument(roomId, documentTitle);

						if (updatedDocument) {
							setLocalTitle(documentTitle);
						}
					}
				} catch (error) {
					console.error(error);
				} finally {
					// 确保状态复位
					setLoading(false);
					setEditing(false);
				}
				// setEditing(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [roomId, documentTitle, editing]);

	useEffect(() => {
		if (editing && inputRef.current) {
			inputRef.current.focus();
		}
	}, [editing]);

	return (
		<RoomProvider id={roomId}>
			<ClientSideSuspense fallback={<Loader />}>
				<div className="collaborative-room">
					<Header>
						<div className="md:flex-1">
							<Link href="/" className="inline-block">
								<Button size="sm" variant="outline" className="gap-1 pr-2">
									<ChevronLeftIcon />
									返回
								</Button>
							</Link>
						</div>
						<div
							ref={containerRef}
							className="flex w-fit items-center justify-center gap-2"
						>
							{editing && !loading ? (
								<Input
									type="text"
									value={documentTitle}
									ref={inputRef}
									placeholder="输入标题"
									onChange={e => setDocumentTitle(e.target.value)}
									onKeyDown={updateTitleHandler}
									disabled={!editing}
									className="document-title-input"
								/>
							) : (
								<>
									<p className="document-title">{documentTitle}</p>
								</>
							)}

							{currentUserType === "editor" && !editing && (
								<EditIcon
									size={22}
									onClick={() => setEditing(true)}
									className="cursor-pointer mt-0.5 text-neutral-500"
								/>
							)}

							{currentUserType !== "editor" && !editing && (
								<p className="view-only-tag">只读</p>
							)}

							{loading && (
								<div className="flex gap-3 items-center text-xs text-gray-400">
									<Loader size={20} />
									<p className="whitespace-nowrap">保存中...</p>
								</div>
							)}
						</div>
						<div className="flex w-full items-center flex-1 justify-end gap-2 sm:gap-5">
							<ActiveCollaborators />
							<ShareModal
								roomId={roomId}
								collaborators={users}
								creatorId={roomMetadata.creatorId}
								currentUserType={currentUserType}
							/>
							<SignedOut>
								<SignInButton />
							</SignedOut>
							<SignedIn>
								<UserButton />
							</SignedIn>
						</div>
					</Header>

					<Editor roomId={roomId} currentUserType={currentUserType} />
				</div>
			</ClientSideSuspense>
		</RoomProvider>
	);
};

export default CollaborativeRoom;
