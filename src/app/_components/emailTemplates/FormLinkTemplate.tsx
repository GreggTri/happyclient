import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface FormLinkTemplateProps {
  surveyLink: string;
  companyName: string;
}

export const FormLinkTemplate = ({
  surveyLink,
  companyName,
}: FormLinkTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>{`${companyName} Invites You To Share Your Experience`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={contentSection}>
            <Text style={greeting}>Survey from {companyName}</Text>
            <Text style={message}>
              We appreciate you taking the time out of your day to help us grow
              and provide an exceptional experience not only to you but to all
              of our clients!
            </Text>
            <Text style={greeting}>Complete Your Survey Here:</Text>
            <Button href={surveyLink}>{surveyLink}</Button>
            <Text style={footer}>Thank you for your time and feedback!</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default FormLinkTemplate;

const main = {
  backgroundColor: "#f9fafb",
  padding: "20px 0",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  maxWidth: "600px",
  margin: "0 auto",
  padding: "40px",
  textAlign: "center" as const,
};

const contentSection = {
  textAlign: "center" as const,
};

const greeting = {
  fontSize: "20px",
  color: "#333333",
  marginBottom: "10px",
  fontWeight: "bold" as const,
};

const message = {
  fontSize: "16px",
  color: "#555555",
  lineHeight: "1.6",
  marginBottom: "30px",
};

const footer = {
  fontSize: "14px",
  color: "#777777",
  marginTop: "20px",
};
