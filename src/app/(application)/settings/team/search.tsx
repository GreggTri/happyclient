"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Icons } from "@/app/_components/icons";
import { useDebouncedCallback } from "use-debounce"

interface SearchProps {
    placeholder: string;
}

const Search: React.FC<SearchProps> = ({placeholder}) => {

    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();

    

    
    const handleSearch = useDebouncedCallback((e) => {

        const params = new URLSearchParams(searchParams)

        params.set("page", "1");

        if(e.target.value && e.target.value.length > 1){
            params.set("q", e.target.value)
        } else {
            params.delete("q")
        }
        

        replace(`${pathname}?${params}`)
    }, 400)


    return (
        <div className="flex items-center gap-2 bg-black/30 p-2 rounded-lg w-max">
            <Icons.Search/>
            <input
                type="text"
                placeholder={placeholder}
                className="border-none bg-transparent outline-none"
                onChange={handleSearch}
            />
        </div>
    )
}

export default Search