import mongoose, { Schema, Document } from "mongoose"

export interface Organization extends Document {
    email: string
    organization: string
    password: string
    role: string;
}

const OrganizationSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true},
    organization: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    role: { type: String, required: true, default: "organization"}
})



export default mongoose.model<Organization>("Organization", OrganizationSchema)
