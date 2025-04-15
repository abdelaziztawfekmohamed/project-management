import { FaProjectDiagram } from 'react-icons/fa';

export default function AppLogo() {
    return (
        <>
            <div className="flex size-10 items-center justify-center rounded-xl bg-green-600 object-contain text-lg dark:bg-green-600">
                {/* <AppLogoIcon className="size-5 fill-current text-white dark:text-black" /> */}
                <div className="flex size-10 items-center justify-center rounded-xl bg-green-600 object-contain text-lg group-data-[collapsible=icon]:size-8 dark:bg-green-600">
                    <FaProjectDiagram className="size-5 fill-current text-white group-data-[collapsible=icon]:size-4 dark:text-white" />
                </div>
            </div>
            <div className="ml-1 grid flex-1 text-left group-data-[collapsible=icon]:hidden">
                <span className="mb-0.5 truncate leading-none">
                    <span className="text-xl font-bold text-black dark:text-white">Plan</span>
                    <span className="text-xl text-black dark:text-white">ova</span>
                </span>
            </div>
        </>
    );
}
