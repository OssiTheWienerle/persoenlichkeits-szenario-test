import { env } from 'cloudflare:workers';
import {handleReport,reportStatus} from '@/lib/report';
import type {ReportEnv} from '@/lib/report';
export async function GET(){return reportStatus(env as ReportEnv);}
export async function POST(request:Request){return handleReport(request,env as ReportEnv);}
