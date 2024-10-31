
import { getSurveyDetails } from '@/app/_data/survey';
import FormDetailComponent from '../FormDetailComponent'
import { Icons } from '@/app/_components/icons';
import { cn } from '@/app/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
interface SurveyPageProps {
    params: { id: string };
  }
async function AddGroupPage({ params }: SurveyPageProps) {
    const surveyId = params.id;
    const survey = await getSurveyDetails(surveyId);
    if (!survey || survey.surveyState === "DRAFT") {
        return <div>Survey not found or not available.</div>;
    }
    return (

        <div>
            <Link
                href={`/dashboard/forms/detail/${surveyId}`}
                className={cn(
                buttonVariants({ variant: "outline" }),
                "absolute left-32 top-32 md:left-32 md:top-32 text-white"
                )}
            >
                <>
                    <Icons.chevronLeft className="mr-2 h-4 w-4" />
                    Back
                </>
            </Link>
            <FormDetailComponent survey={survey}/>
        </div>
        
    
    
    )

}

export default AddGroupPage