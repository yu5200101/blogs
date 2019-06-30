/*
dom diff 比较只会在同层级进行，不会跨层级比较
diff的过程就是调用patch函数，就像打补丁一样修改真实dom。
*/
function patch(oldNode, vnode) {
    if (sameVnode(oldVnode, vnode)) {
        patchVnode(oldVnode, vnode);
    } else {
        /*
        取得oldvnode.el的父节点，parentEle是真实dom
        createEle(vnode)会为vnode创建它的真实dom，令vnode.el = 真实dom
        parentEle将新的dom插入，移除旧的dom
        当不值得比较时，新节点直接把老节点整个替换了
        */
        const oE1 = oldVnode.el;
        let parentEle = api.parentNode(oE1)
        createEle(vnode);
        if (parentEle !== null) {
            api.insertBefore(parentEle, vnode.el, api.nextSibling(oE1))
            api.removeChild(parentEle, oldVnode.el)
            oldVnode = null
        }
    }
    /*
        patch最后会返回vnode，vnode和进入patch之前的不同在哪？
        之前vnode.el = null,而现在它引用的是对应的真实dom
        var oldVnode = patch(oldVnode, vnode);
    */
    return vnode
}
/* sameVnode函数就是看这两个节点是否值得比较 */
function sameVnode(oldVnode, vnode) {
    return vnode.key === oldVnode.key && vnode.sel === oldVnode.sel
}
/*
两个节点值得比较时，会调用patchVnode函数
*/


function patchVnode(oldVnode, vnode) {
    const el = vnode.el = oldVnode.el; // 让vnode.el引用到现在的真实dom,当el修改时，vnode.el会同步变化
    let i, oldCh = oldVnode.children,
        ch = vnode.children;
    /*
    节点的比较有5种情况
    1.if(oldVnode === vnode) 他们引用一致，可以认为没有变化
    2.if(oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text)文本节点的比较，需要修改，则会调用Node.textContent = vnode.text
    3.if(oldCh && ch && oldCh !== ch) 两个节点都有子节点，而且它们不一样，这样我们会调用updateChildren函数比较子节点，这是diff的核心，后边会讲到
    4.if(oldCh) 新节点没有节点，老节点有节点，直接删除老节点
    5.if(ch) 只有新的节点有子节点， 调用createEle(vnode), vnode.el已经引用了老的dom节点，createEle函数会在老dom节点上添加子节点
    */
    if (oldVnode === vnode) return;
    if (oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text) {
        api.setTextContent(el, vnode.text);
    } else {
        updateEle(el, vnode, oldVnode);
        if (oldCh && ch && oldCh !== ch) {
            updateChildren(el, oldCh, ch);
        } else if (ch) {
            createEle(vnode);
        } else if (oldCh) {
            api.removeChildren(el);
        }
    }
}

function updateChildren(parentElm, oldCh, newCh) {
    let oldStartIdx = 0,
        newStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newEndIdx = newCh.length - 1;
    let newEndVnode = newCh[newEndIdx];
    let oldKeyToIdx, idxInOld, elmToMove, before;
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (oldStartVnode == null) {
            //对于vnode.key的比较，会把oldVnode = null
            oldStartVnode = oldCh[++oldStartIdx];
        } else if (oldEndVnode == null) {
            oldEndVnode = oldCh[--oldEndIdx];
        } else if (newStartVnode == null) {
            newEndVnode = newCh[++newStartIdx];
        } else if (newEndVnode == null) {
            newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
            patchVnode(oldStartVnode, newStartVnode);
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
            patchVnode(oldEndVnode, newEndVnode);
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldStartVnode, newEndVnode)) {
            patchVnode(oldStartVnode, newEndVnode);
            api.insertBefore(parentElm, oldStartVnode.el, api.nextSibling(oldEndVnode.el));
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldEndVnode, newStartVnode)) {
            patchVnode(oldEndVnode, newStartVnode);
            api.insertBefore(parentElm, oldEndVnode.el, oldStartVnode.el);
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        } else {
            //使用key时的比较
            if (oldKeyToIdx === undefined) {
                oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); //有key生成index表
            }
            idxInOld = oldKeyToIdx[newStartVnode.key];
            if (!idxInOld) {
                api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el);
                newStartVnode = newCh[++newStartIdx];
            }
            else {
                elmToMove = oldCh[idxToOld];
                if(elmToMove.sel !== newStartVnode.sel){
                    api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el);
                } else {
                    patchVnode(elmToMove, newStartVnode);
                    oldCh[idxInOld] = null;
                    api.insertBefore(parentElm, eleToMove.el, oldStartVnode.el);
                }
                newStartVnode = newCh[++newStartIdx];
            }
        }
    }
    if(oldStartIdx > oldEndIdx) {
        before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].el;
        addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx);
    } else if(newStartIdx > newEndIdx) {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
}