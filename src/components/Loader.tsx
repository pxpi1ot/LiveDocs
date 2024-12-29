import Image from "next/image";

const Loader = ({ size = 32 }: { size?: number }) => {
	return (
		<div className="loader">
			<Image
				src="/assets/icons/loader.svg"
				alt="loader"
				width={size}
				height={size}
				className="animate-spin "
			/>
		</div>
	);
};

export default Loader;
