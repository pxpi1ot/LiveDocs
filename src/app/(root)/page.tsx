// import AddDocumentBtn from '@/components/AddDocumentBtn';
// import { DeleteModal } from '@/components/DeleteModal';
import AddDocumentBtn from "@/components/AddDocumentBtn";
import Header from "@/components/Header";
import Notifications from "@/components/Notifications";
// import Notifications from '@/components/Notifications';
import { Button } from "@/components/ui/button";
import { getDocuments } from "@/lib/actions/room.actions";
import { dateConverter } from "@/lib/utils";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { FileTextIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Home = async () => {
	const clerkUser = await currentUser();
	if (!clerkUser) redirect("/sign-in");

	const roomDocuments = await getDocuments(
		clerkUser.emailAddresses[0].emailAddress
	);

	return (
		<main className="home-container">
			<Header className="sticky left-0 top-0">
				<div className="md:flex-1">
					<Link href="/" className="inline-block">
						<div className="w-fit flex p-2 gap-2 font-semibold items-center">
							<div className="rounded-md bg-emerald-400 text-white p-1">
								<FileTextIcon size={20} />
							</div>
							实时文档
						</div>
					</Link>
				</div>
				<div className="flex items-center gap-2 lg:gap-4">
					<Notifications />
					<SignedIn>
						<UserButton />
					</SignedIn>
				</div>
			</Header>

			{roomDocuments.data.length > 0 ? (
				<div className="document-list-container">
					<div className="document-list-title">
						<h3 className="text-28-semibold">文档</h3>
						<AddDocumentBtn
							userId={clerkUser.id}
							email={clerkUser.emailAddresses[0].emailAddress}
						/>
					</div>
					<ul className="document-ul">
						{roomDocuments?.data.map(({ id, metadata, createdAt }: any) => (
							<li key={id} className="document-list-item">
								<Link
									href={`/documents/${id}`}
									className="flex flex-1 items-center gap-6"
								>
									<div className="hidden rounded-md bg-neutral-100 p-2 sm:block">
										<div className="rounded-md  text-neutral-600 p-1">
											<FileTextIcon size={25} />
										</div>
									</div>
									<div className="space-y-1">
										<p className="line-clamp-1 text-md">{metadata.title}</p>
										<p className="text-sm text-neutral-400">
											创建于 {dateConverter(createdAt)}
										</p>
									</div>
								</Link>
								{/* <DeleteModal roomId={id} /> */}
							</li>
						))}
					</ul>
				</div>
			) : (
				<div className="document-list-empty">
					<div className="flex p-2 gap-1 font-semibold text-emerald-400 text-2xl">
						{/* <FileTextIcon /> */}
						你还没有加入或者创建文档
					</div>

					<AddDocumentBtn
						userId={clerkUser.id}
						email={clerkUser.emailAddresses[0].emailAddress}
					/>
				</div>
			)}
		</main>
	);
};

export default Home;
