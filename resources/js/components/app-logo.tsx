import { FaProjectDiagram } from 'react-icons/fa';

export default function AppLogo() {
    return (
        <>
            <div className="flex size-10 items-center justify-center rounded-xl bg-green-300 text-lg dark:bg-green-500">
                {/* <AppLogoIcon className="size-5 fill-current text-white dark:text-black" /> */}
                <FaProjectDiagram className="fill-current text-white dark:text-white" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none">
                    <span className="text-xl font-bold text-black dark:text-white">Plan</span>
                    <span className="text-lg text-black dark:text-white">ova</span>
                </span>
            </div>
        </>
    );
}
