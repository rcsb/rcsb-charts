import * as React from "react";
import {TagDelimiter} from "../../../RcsbUtils/Helpers/TagDelimiter";
import * as resource from "../../../RcsbServerConfig/web.resources.json";
import {GroupProvenanceId} from "@rcsb/rcsb-api-tools/build/RcsbDw/Types/DwEnums";

interface GroupMemberItemInterface {
    item: ItemFeaturesInterface;
    groupProvenanceId: GroupProvenanceId;
}

export interface ItemFeaturesInterface {
    entryId: string;
    asymId?: string;
    entityId?: string;
    taxNames: Array<string>;
    name: string;
    experimentalMethod: string;
    resolution: number;
    sequenceLength?:number;
    molecularWeight:number;
}

const NA: string = "N/A";
export class GroupMemberItem extends React.Component<GroupMemberItemInterface,{}>{

    render() {
        return (
            <div>
                <div><img src={memberImgUrl(this.props.item, this.props.groupProvenanceId)}  alt={"image"} style={{width:"100%"}}/></div>
                <div className={"bg-light border-top p-md-4"}>
                    <div>
                        <strong>{memberSummaryUrlText(this.props.item, this.props.groupProvenanceId)} </strong>
                        <span> - </span>
                        <a href={memberSummaryUrl(this.props.item, this.props.groupProvenanceId)}>Summary</a>
                        <span> | </span>
                        <a href={member3DViewUrl(this.props.item, this.props.groupProvenanceId)}>Structure</a>
                    </div>
                    <div style={{textOverflow:"ellipsis",whiteSpace:"nowrap",overflow:"hidden"}} title={this.props.item.name}><strong>Name: </strong>{this.props.item.name}</div>
                    <div style={{textOverflow:"ellipsis",whiteSpace:"nowrap",overflow:"hidden"}}><strong>Organism: </strong>{this.props.item.taxNames.join(", ")}</div>
                    <div style={{textOverflow:"ellipsis",whiteSpace:"nowrap",overflow:"hidden"}} title={this.props.item.experimentalMethod}><strong>Experimental Method: </strong>{this.props.item.experimentalMethod ?? NA}</div>
                    {
                        (<div style={{textOverflow:"ellipsis",whiteSpace:"nowrap",overflow:"hidden"}}><strong>Resolution: </strong>{this.props.item.resolution ?  `${this.props.item.resolution} Å` : NA}</div>)
                    }
                    {
                        this.props.item.molecularWeight ? (<div style={{textOverflow:"ellipsis",whiteSpace:"nowrap",overflow:"hidden"}}><strong>Molecular Weight: </strong>{`${this.props.item.molecularWeight} kDa`}</div>) : null
                    }
                </div>
            </div>
        );
    }
}

function memberImgUrl(ei: ItemFeaturesInterface, groupProvenanceId: GroupProvenanceId): string{
    if(groupProvenanceId === GroupProvenanceId.ProvenanceMatchingDepositGroupId)
        return resource.rcsb_cdn.url + ei.entryId.toLowerCase().substring(1, 3) + "/" + ei.entryId.toLowerCase() + "/" + ei.entryId.toLowerCase() + "_model-1.jpeg";
    return resource.rcsb_cdn.url + (TagDelimiter.isRcsbId(ei.entityId) ? ei.entryId.toLowerCase().substring(1, 3) + "/" + ei.entryId.toLowerCase() : "") + "/" + ei.entryId.toLowerCase() + "_chain-" + ei.asymId + ".jpeg";
}

function memberSummaryUrl(ei: ItemFeaturesInterface, groupProvenanceId: GroupProvenanceId): string{
    if(groupProvenanceId === GroupProvenanceId.ProvenanceMatchingDepositGroupId)
        return resource.rcsb_entry.url + ei.entryId.toLowerCase();
    return resource.rcsb_entry.url + ei.entryId.toLowerCase() + "#entity-" + ei.entityId;
}

function member3DViewUrl(ei: ItemFeaturesInterface, groupProvenanceId: GroupProvenanceId): string{
    return resource.rcsb_3d_view.url + ei.entryId.toLowerCase();
}

function memberSummaryUrlText(ei: ItemFeaturesInterface, groupProvenanceId: GroupProvenanceId): string{
    if(groupProvenanceId === GroupProvenanceId.ProvenanceMatchingDepositGroupId)
        return ei.entryId;
    return ei.entryId+TagDelimiter.entity+ei.entityId;
}