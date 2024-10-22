//This is only commented out because it might be useful for when thing feature needs to be built

// import { Input } from '@/app/_components/ui/input'
// import { Button } from '@/components/ui/button'
// import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
// import { toast } from '@/hooks/use-toast'
// import { zodResolver } from '@hookform/resolvers/zod'
// import React from 'react'
// import { Form, useForm } from 'react-hook-form'
// import { z } from 'zod'

// const CustomDomainFormSchema = z.object({
//     subDomain: z.string().regex(/^[a-zA-Z0-9-]+$/).optional(),
//     customerBaseDomain: z.string().regex(/^[a-zA-Z0-9-]+$/).optional(),
// })
  
// type CustomDomainSchemaType = z.infer<typeof CustomDomainFormSchema>

// function CustomDomainForm({domain}: {domain: string}) {

//     const form = useForm<CustomDomainSchemaType>({
//         resolver: zodResolver(CustomDomainFormSchema),
//         defaultValues: {
//             subDomain: domain.split('.')[0] || "",
//             customerBaseDomain: domain.split('.')[1] || ""
//         }
//     })

//     const onSubmit = async (data: CustomDomainSchemaType) => {
//         try {
//           const customDomainOrg = await upsertCustomDomain(data);

//           if( customDomainOrg && 'id' in customDomainOrg){
//             toast({
//                 title: "Success!",
//                 description: `Survey ${data.surveyTitle} was renamed to ${renamedSurvey.surveyTitle}`,
//                 variant: "destructive",
//                 className: "bg-green-500 border-none"
//             })
//           } else {
//             throw new Error("Renaming survey failed!")
//           }
          
//         } catch (error) {
//           toast({
//             title: "Renaming survey failed!",
//             description: "Something went wrong! Please try again later and/or contact support!",
//             variant: "destructive",
//             className: "bg-red-500 border-none"
//           })
//         }
//     };

//     return (
//         <Form {...form}>
//             <form className="space-y-2">
//             <FormField
//                 control={form.control}
//                 name="subDomain"
//                 render={({field}) => (
//                 <FormItem>
//                     <FormLabel>
//                         Title
//                     </FormLabel>
//                     <FormControl>
//                         <Input {...field}/>
//                     </FormControl>
//                 </FormItem>
//                 )}  
//             />
//             <FormField
//                 control={form.control}
//                 name="customerBaseDomain"
//                 render={({field}) => (
//                 <FormItem>
//                     <FormLabel>
//                         Title
//                     </FormLabel>
//                     <FormControl>
//                         <Input {...field}/>
//                     </FormControl>
//                 </FormItem>
//                 )}  
//             />
//             <Button/>
//             </form>
//         </Form>
//     )
// }
// export default CustomDomainForm