"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Pagination = ({count}: {count: number}) => {

    const pageParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();
    const ITEM_PER_PAGE = 3

    let page = pageParams.get("page") || 1;

    if(typeof page === "string"){
        page = parseInt(page)
    }

    const hasPrev = ITEM_PER_PAGE * ((page)-1 ) > 0
    const hasNext = ITEM_PER_PAGE * (page - 1) + ITEM_PER_PAGE < count

    const params = new URLSearchParams(pageParams)

    const handlePagination = (type: string) => {
        type === "prev" ? params.set("page", (page - 1).toString()) : params.set("page", (page + 1).toString())

        replace(`${pathname}?${params}`)
    }

    return (
        <div className="flex p-3 justify-between ">
            <button 
            className="px-3 py-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50" 
            onClick={()=>handlePagination("prev")}
            disabled={!hasPrev}>
                Previous
            </button>

            <button 
            className="px-3 py-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50" 
            onClick={()=>handlePagination("next")}
            disabled={!hasNext}>
                Next
            </button>
        </div>
    )
}


export default Pagination