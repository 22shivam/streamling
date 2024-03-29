/// <reference types="mongoose" />
interface Viewer {
    username: string;
    publicKey: string;
    following: [string];
    followers: [string];
    totalFollowing: number;
    totalFollowers: number;
}
declare const ViewerModel: import("mongoose").Model<Viewer, {}, {}, {}>;
export default ViewerModel;
export { ViewerModel, Viewer };
//# sourceMappingURL=viewers.d.ts.map