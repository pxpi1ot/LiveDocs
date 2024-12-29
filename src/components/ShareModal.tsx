"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { useSelf } from "@liveblocks/react/suspense";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import UserTypeSelector from "./UserTypeSelector";
import Collaborator from "./Collaborator";
import { updateDocumentAccess } from "@/lib/actions/room.actions";
import { Share2Icon } from "lucide-react";

const ShareModal = ({
	roomId,
	collaborators,
	creatorId,
	currentUserType,
}: ShareDocumentDialogProps) => {
	const user = useSelf();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const [email, setEmail] = useState("");
	const [userType, setUserType] = useState<UserType>("viewer");

	const shareDocumentHandler = async () => {
		setLoading(true);

		await updateDocumentAccess({
			roomId,
			email,
			userType: userType as UserType,
			updatedBy: user.info,
		});

		setLoading(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					className="bg-emerald-400 hover:bg-emerald-400/90 flex gap-2 px-2"
					disabled={currentUserType !== "editor"}
					size="sm"
				>
					<Share2Icon />
					<p className="hidden sm:block">分享</p>
				</Button>
			</DialogTrigger>
			<DialogContent className="shad-dialog">
				<DialogHeader>
					<DialogTitle>谁可以查看此项目</DialogTitle>
					<DialogDescription>哪些用户可以查看和编辑此文档</DialogDescription>
				</DialogHeader>

				<Label htmlFor="email" className="mt-6 text-slate-500">
					电子邮件地址
				</Label>
				<div className="flex items-center gap-3">
					<div className="flex flex-1 rounded-md border">
						<Input
							id="email"
							placeholder="输入电子邮件地址"
							value={email}
							onChange={e => setEmail(e.target.value)}
							className="share-input"
						/>
						<UserTypeSelector userType={userType} setUserType={setUserType} />
					</div>
					<Button
						type="submit"
						onClick={shareDocumentHandler}
						className="bg-emerald-400 hover:bg-emerald-400/85 flex h-full gap-1 px-5"
						disabled={loading}
					>
						{loading ? "发送中..." : "邀请"}
					</Button>
				</div>

				<div className="my-2 space-y-2">
					<ul className="flex flex-col">
						{collaborators.map(collaborator => (
							<Collaborator
								key={collaborator.id}
								roomId={roomId}
								creatorId={creatorId}
								email={collaborator.email}
								collaborator={collaborator}
								user={user.info}
							/>
						))}
					</ul>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ShareModal;
