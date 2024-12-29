"use client";

import { createDocument } from "@/lib/actions/room.actions";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const AddDocumentBtn = ({ userId, email }: AddDocumentBtnProps) => {
	const router = useRouter();

	const addDocumentHandler = async () => {
		try {
			const room = await createDocument({ userId, email });

			if (room) router.push(`/documents/${room.id}`);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Button
			type="submit"
			onClick={addDocumentHandler}
			className="bg-gradient-to-b from-emerald-400 to-emerald-500 flex gap-1 shadow-md hover:opacity-90 transition"
		>
			<Image src="/assets/icons/add.svg" alt="add" width={24} height={24} />
			<p className="hidden sm:block">创建空白文档</p>
		</Button>
	);
};

export default AddDocumentBtn;
