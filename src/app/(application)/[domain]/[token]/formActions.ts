"use server"


export async function submitSurveyData(token: string, jsonContent: string){
    return {token, jsonContent};
}