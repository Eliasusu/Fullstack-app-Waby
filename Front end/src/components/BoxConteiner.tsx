export default function BoxContainer({children, width, height}: {children: React.ReactNode, width: string, height: string}){
    return (
        <div className={`bg-grey-box/60 border-[1px] border-white/30 rounded-lg shadow-lg p-4 w-[285px] h-[340px] `}>
            {children}
        </div>
    );
}