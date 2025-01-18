import {Schema, Document, model} from "mongoose";

type User = Document & {
    id: string;
    name: string;
    surname: string,
    email: string;
    password: string;
};

const UserSchema: Schema = new Schema({
    name: {type: String, required: true},
    surname: {type: String, required: false},
    email: {type: String, required: true, unique: true},
    password:  {type: String, required: true},
},
{ timestamps: true })

const User = model<User>("User", UserSchema)

export default User;

