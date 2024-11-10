import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface InviteUserEmailProps {
  firstName?: string;
  lastName?: string;
  invitedByEmail?: string;
  companyName?: string;
  inviteLink?: string;
}

export const InviteUserEmail = ({
  firstName = "Gregg",
  lastName = "Trimarchi",
  invitedByEmail = "gregg@breyerlaw.com",
  companyName = "The Husband & Wife Law Team",
  inviteLink = "https://vercel.com/teams/invite/foo",
}: InviteUserEmailProps) => {
  const previewText = `Join ${firstName} ${lastName} on Happy Client`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded-md my-[40px] mx-auto p-[20px] max-w-[465px] shadow-md">
            {/* <Img
            src={`${baseUrl}/static/dropbox-logo.png`}
            width="40"
            height="33"
            alt="Dropbox"
          /> */}
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Join <strong>{companyName}</strong> on{" "}
              <strong>Happy Client</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong>
                {firstName} {lastName}
              </strong>{" "}
              (
              <Link
                href={`mailto:${invitedByEmail}`}
                className="text-blue-600 no-underline"
              >
                {invitedByEmail}
              </Link>
              ) has invited you to <strong>{companyName}</strong> on{" "}
              <strong>Happy Client</strong>.
            </Text>
            <Section></Section>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#f4e300] rounded text-black text-[16px] font-semibold no-underline text-center px-5 py-3 shadow"
                href={inviteLink}
              >
                Join the team!
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{" "}
              <Link href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default InviteUserEmail;