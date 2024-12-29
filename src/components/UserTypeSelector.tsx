import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const UserTypeSelector = ({
	userType,
	setUserType,
	onClickHandler,
}: UserTypeSelectorParams) => {
	const accessChangeHandler = (type: UserType) => {
		setUserType(type);
		onClickHandler && onClickHandler(type);
	};

	return (
		<Select
			value={userType}
			onValueChange={(type: UserType) => accessChangeHandler(type)}
		>
			<SelectTrigger className="shad-select">
				<SelectValue className="" />
			</SelectTrigger>
			<SelectContent className="border-none text-neutral-500">
				<SelectItem value="viewer" className="">
					可以查看
				</SelectItem>
				<SelectItem value="editor" className="">
					可以编辑
				</SelectItem>
			</SelectContent>
		</Select>
	);
};

export default UserTypeSelector;
