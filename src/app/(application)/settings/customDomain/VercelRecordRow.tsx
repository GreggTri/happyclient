'use client'

import { Icons } from '@/app/_components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import React, { useState } from 'react'

function RecordRow({record}: {record: {
    value: string,
    type: string,
    domain: string,
    reason: string
}}) {
    
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyClick = () => {
        // Copy the value to the clipboard
        navigator.clipboard.writeText(record.value);

        // Set isCopied to true to switch the icon
        setIsCopied(true);

        // Reset isCopied after 2 seconds to switch back the icon
        setTimeout(() => {
        setIsCopied(false);
        }, 1000);
    };
    
    return (
        <TableRow key={record.value}>
            <TableCell>{record.type}</TableCell>
            <TableCell>{record.domain}</TableCell>
            <TableCell
                className="w-40 "  
            >
                <div className='flex items-center'>
                    <span 
                        className='truncate overflow-hidden text-ellipsis whitespace-nowrap' 
                        title={record.value}
                    >
                        {record.value}
                    </span>
            
                    <Button
                        variant={'ghost'}
                        onClick={handleCopyClick}
                        className="ml-0 pl-0 text-gray-500 hover:underline"
                    >
                        
                        {isCopied ? 
                            <Icons.copyCheck className='animate-pop text-green-500'/> 
                        : 
                            <Icons.copy className='animate-pop '/>
                        }
                        
                    </Button>
                </div>
            
            </TableCell>
            <TableCell>{record.reason}</TableCell>
            <TableCell>
            <Badge
                className='bg-red-500'
            >
                Not Verified
            </Badge>
            </TableCell>
        </TableRow>
    )
}

export default RecordRow