'use server'
import { getAllSurveys } from "@/app/_data/survey";
import AnalyticsComponent from "./AnalyticsComponent";

const AnalyticsPage = async() => {

  //get list of surveys with title and Id
  const listOfSurveys = await getAllSurveys()
  if(!listOfSurveys || listOfSurveys.length == 0){
    return <div className="flex text-red-500 w-screen h-full justify-center my-20">Surveys not found or not available.</div>;
  }

  return <AnalyticsComponent surveys={listOfSurveys}/>
}



export default AnalyticsPage